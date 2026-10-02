"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataImporter = void 0;
const tslib_1 = require("tslib");
const import_container_1 = require("../containers/import/import-container");
const container_enum_1 = require("../models/enums/container.enum");
const fs = tslib_1.__importStar(require("fs"));
const path = tslib_1.__importStar(require("path"));
const logging_enable_1 = require("../utils/logging-enable");
const logger_1 = require("../utils/logger");
const container_utils_1 = require("../utils/container-utils");
const logger = new logger_1.Logger('DataImporter');
class DataImporter {
    imageResolver;
    logFilePathProvider;
    constructor(imageResolver, logFilePathProvider) {
        this.imageResolver = imageResolver;
        this.logFilePathProvider = logFilePathProvider;
    }
    /**
     * Import default data using the ImportManagerContainer
     */
    async importDefaultData(network, startedContainers, config) {
        // Platform config is already set globally by PlatformManager
        logger.info(`${logger_1.LogMessages.DATA_IMPORT_START}: ${startedContainers.size} containers available for import`);
        try {
            // Create container info file before starting the import container
            const containerInfoPath = this.createContainerInfo(startedContainers);
            const importContainerLogPath = this.logFilePathProvider?.(container_enum_1.CONTAINER.IMPORT_MANAGER);
            const importImage = await this.imageResolver.getImportManagerBaseImage(config);
            const importContainer = new import_container_1.ImportManagerContainer(importImage, containerInfoPath, config)
                .withNetwork(network)
                .withLoggingEnabled((0, logging_enable_1.loggingEnabled)(config, [container_enum_1.CONTAINER.IMPORT_MANAGER]));
            if (importContainerLogPath) {
                importContainer.withLogFilePath(importContainerLogPath);
            }
            const importer = await importContainer.start();
            const stopImportLogForwarding = await this.startImportLogForwarding(importer);
            logger.info(`${logger_1.LogMessages.CONTAINER_STARTED}: Import container ${importImage} - monitoring import process`);
            if (importContainerLogPath) {
                logger.info(`${logger_1.LogMessages.CONTAINER_STARTED}: Import container logs file: ${importContainerLogPath}`);
            }
            // Monitor the import process by executing commands in the container
            try {
                await new Promise((resolve, reject) => {
                    const checkInterval = setInterval(async () => {
                        try {
                            const isStillRunning = await this.checkImportStatus(importer);
                            if (!isStillRunning) {
                                clearInterval(checkInterval);
                                logger.info(`${logger_1.LogMessages.DATA_IMPORT_PROCESS_COMPLETE}: Import container finished`);
                                resolve();
                            }
                            else {
                                logger.info(`${logger_1.LogMessages.DATA_IMPORT_PROCESS_RUNNING}: Import container still running`);
                            }
                        }
                        catch (error) {
                            clearInterval(checkInterval);
                            logger.error(`${logger_1.LogMessages.DATA_IMPORT_PROCESS_ERROR}: Import container error`, undefined, error);
                            resolve();
                        }
                    }, 2000);
                    setTimeout(() => {
                        clearInterval(checkInterval);
                        reject(new Error('Import timeout after 1 minutes'));
                    }, 1 * 60 * 1000);
                });
            }
            finally {
                stopImportLogForwarding();
            }
            logger.success(`${logger_1.LogMessages.DATA_IMPORT_SUCCESS}: Import completed successfully`);
            this.cleanupContainerInfo(containerInfoPath);
        }
        catch (error) {
            logger.error(`${logger_1.LogMessages.DATA_IMPORT_FAILED}: Import failed`, undefined, error);
            throw error;
        }
    }
    /**
     * Create container info JSON file with container details
     * @param startedContainers Map of started containers
     * @returns Path to the created container info file
     */
    createContainerInfo(startedContainers) {
        const keycloakContainer = this.extractKeycloakContainer(startedContainers);
        const keycloakInfo = this.buildKeycloakInfo(keycloakContainer);
        const shellUiContainer = this.extractShellUiContainer(startedContainers);
        const shellUiInfo = this.buildShellUiInfo(shellUiContainer);
        const services = this.buildServicesInfo(startedContainers);
        const containerInfo = {
            tokenValues: {
                username: keycloakInfo.username,
                password: keycloakInfo.password,
                realm: keycloakInfo.realm,
                alias: keycloakInfo.alias,
                port: keycloakInfo.port,
                clientId: shellUiInfo.clientId,
            },
            services: services,
        };
        return this.writeContainerInfoFile(containerInfo);
    }
    extractKeycloakContainer(startedContainers) {
        const keycloakContainer = startedContainers.get(container_enum_1.CONTAINER.KEYCLOAK);
        if (!keycloakContainer || !(0, container_utils_1.isKeycloakContainer)(keycloakContainer)) {
            throw new Error('Keycloak container not found or invalid type in started containers');
        }
        return keycloakContainer;
    }
    buildKeycloakInfo(keycloakContainer) {
        return {
            username: keycloakContainer.getRealm(),
            password: keycloakContainer.getRealm(),
            realm: keycloakContainer.getRealm(),
            alias: keycloakContainer.getNetworkAliases()[0],
            port: keycloakContainer.getPort(),
        };
    }
    extractShellUiContainer(startedContainers) {
        const shellUiContainer = startedContainers.get(container_enum_1.CONTAINER.SHELL_UI);
        if (!shellUiContainer || !(0, container_utils_1.isShellUiContainer)(shellUiContainer)) {
            throw new Error('Shell UI container not found or invalid type in started containers');
        }
        return shellUiContainer;
    }
    buildShellUiInfo(shellUiContainer) {
        return {
            clientId: shellUiContainer.getClientUserId(),
        };
    }
    /**
     * Build services info from all started containers
     * Creates mapping for all containers that can be services
     * @param startedContainers Map of all started containers
     * @returns Record of service names to their connection info
     */
    buildServicesInfo(startedContainers) {
        const services = {};
        // Iterate through all started containers and extract service info
        for (const [containerName, container] of startedContainers) {
            // Skip E2E containers - they are test runners, not services
            if (containerName.includes('-e2e') || !('getPort' in container)) {
                logger.info(`SERVICE_SKIPPED: ${containerName} - E2E container (test runner, not a service)`);
                continue;
            }
            const serviceName = this.getServiceNameFromContainer(containerName);
            // Only add containers that have a valid service mapping
            if (serviceName && !(0, container_utils_1.isE2eContainer)(container)) {
                services[serviceName] = {
                    alias: container.getNetworkAliases()[0],
                    port: container.getPort(),
                };
                logger.info(`SERVICE_MAPPED: ${containerName} -> ${serviceName} (${container.getNetworkAliases()[0]}:${container.getPort()})`);
            }
            else {
                // Log containers that don't have service mappings for debugging
                logger.info(`SERVICE_SKIPPED: ${containerName} - No service mapping defined (likely UI or infrastructure container)`);
            }
        }
        logger.info(`SERVICES_DISCOVERED: Total services mapped: ${Object.keys(services).length}`);
        return services;
    }
    /**
     * Map container names to service names expected by ImportManager
     * @param containerName The internal container name
     * @returns The service name or null if not a mappable service
     */
    getServiceNameFromContainer(containerName) {
        const containerToServiceMap = {
            // Core services
            [container_enum_1.CONTAINER.TENANT_SVC]: 'onecx-tenant-svc',
            [container_enum_1.CONTAINER.THEME_SVC]: 'onecx-theme-svc',
            [container_enum_1.CONTAINER.PRODUCT_STORE_SVC]: 'onecx-product-store-svc',
            [container_enum_1.CONTAINER.PERMISSION_SVC]: 'onecx-permission-svc',
            [container_enum_1.CONTAINER.PARAMETER_SVC]: 'onecx-parameter-svc',
            [container_enum_1.CONTAINER.WORKSPACE_SVC]: 'onecx-workspace-svc',
        };
        return containerToServiceMap[containerName] || null;
    }
    writeContainerInfoFile(containerInfo) {
        // TODO: Consider using a temporary file or a more secure location for the container info file
        const containerInfoPath = path.resolve(__dirname, '../../../container-info.json');
        // Ensure the directory exists
        const dir = path.dirname(containerInfoPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(containerInfoPath, JSON.stringify(containerInfo, null, 2));
        logger.info(`${logger_1.LogMessages.DATA_IMPORT_FILE_CREATED}: ${containerInfoPath}`);
        return containerInfoPath;
    }
    /**
     * Clean up temporary container info file
     */
    cleanupContainerInfo(containerInfoPath) {
        if (fs.existsSync(containerInfoPath)) {
            fs.unlinkSync(containerInfoPath);
            logger.info(`${logger_1.LogMessages.DATA_IMPORT_CLEANUP}: ${containerInfoPath}`);
        }
    }
    /**
     * Check if the import process is still running
     */
    async checkImportStatus(importer) {
        try {
            // Check if the import process is still running by looking for the node process
            const processResult = await importer.exec(['pgrep', '-f', 'import-runner.ts']);
            return processResult.exitCode === 0; // true if process is still running
        }
        catch {
            // If exec fails, assume import is completed
            return false;
        }
    }
    async startImportLogForwarding(importer) {
        const candidate = importer;
        if (typeof candidate.logs !== 'function') {
            logger.warn(`${logger_1.LogMessages.CONTAINER_FAILED}: Import container does not expose logs()`);
            return () => undefined;
        }
        try {
            const stream = await candidate.logs();
            const onData = (chunk) => {
                const text = chunk.toString();
                for (const line of text.split('\n')) {
                    const trimmed = line.trim();
                    if (trimmed.length > 0) {
                        logger.info(`IMPORT_CONTAINER_LOG: ${trimmed}`);
                    }
                }
            };
            const onError = (error) => {
                logger.warn(`IMPORT_CONTAINER_LOG_ERROR: ${String(error)}`);
            };
            stream.on('data', onData);
            stream.on('error', onError);
            return () => {
                stream.off('data', onData);
                stream.off('error', onError);
                if (typeof stream.destroy === 'function') {
                    ;
                    stream.destroy();
                }
            };
        }
        catch (error) {
            logger.warn(`IMPORT_CONTAINER_LOG_ERROR: Failed to attach import container logs: ${String(error)}`);
            return () => undefined;
        }
    }
}
exports.DataImporter = DataImporter;
//# sourceMappingURL=data-importer.js.map