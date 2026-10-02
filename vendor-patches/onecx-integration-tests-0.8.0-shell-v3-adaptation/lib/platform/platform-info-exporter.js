"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformInfoExporter = void 0;
const tslib_1 = require("tslib");
const path = tslib_1.__importStar(require("path"));
const container_enum_1 = require("../models/enums/container.enum");
const run_context_1 = require("../utils/run-context");
const logger_1 = require("../utils/logger");
const fs = tslib_1.__importStar(require("fs"));
const container_utils_1 = require("../utils/container-utils");
const logger = new logger_1.Logger('PlatformInfoExporter');
class PlatformInfoExporter {
    containerRegistry;
    network;
    outputDir;
    constructor(containerRegistry, network) {
        this.containerRegistry = containerRegistry;
        this.network = network;
        // Resolve output path from centralized run context.
        this.outputDir = (0, run_context_1.resolveRunContextPaths)().e2eDir;
        // Ensure directory exists
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
    }
    /**
     * Get complete platform info with all URLs
     */
    async getPlatformInfo() {
        const containers = await this.getAllContainerInfos();
        return {
            network: {
                name: this.network.getName(),
                id: this.network.getId(),
            },
            e2e: {
                baseUrl: containers[container_enum_1.CONTAINER.SHELL_UI]?.internalUrl ?? '',
                keycloakUrl: containers[container_enum_1.CONTAINER.KEYCLOAK]?.internalUrl ?? '',
            },
            external: {
                shellUi: containers[container_enum_1.CONTAINER.SHELL_UI]?.externalUrl ?? '',
                keycloak: containers[container_enum_1.CONTAINER.KEYCLOAK]?.externalUrl ?? '',
            },
            containers,
        };
    }
    /**
     * Get info for a specific container
     */
    async getContainerInfo(containerName) {
        const container = this.containerRegistry.getContainer(containerName);
        if (!container) {
            return undefined;
        }
        if ((0, container_utils_1.isE2eContainer)(container)) {
            return {
                name: containerName,
                type: 'e2e',
                running: true,
                note: 'E2E runner has no service port mapping',
            };
        }
        if ((0, container_utils_1.isPortAwareContainer)(container)) {
            return await this.buildContainerInfo(containerName, container);
        }
        return {
            name: containerName,
            type: 'custom',
            running: true,
            note: 'Container does not expose getPort()',
        };
    }
    /**
     * Get all container infos - dynamically from registry
     */
    async getAllContainerInfos() {
        const infos = {};
        // Get all containers from registry
        const allContainers = this.containerRegistry.getAllContainers();
        for (const [name, container] of allContainers) {
            const exportDecision = (0, container_utils_1.getPlatformInfoExportDecision)(container);
            if (!exportDecision.include) {
                logger.info(`CONTAINER_SKIPPED: ${name} - ${exportDecision.reason ?? 'Skipped by export policy'}`);
                continue;
            }
            if ((0, container_utils_1.isPortAwareContainer)(container)) {
                infos[name] = await this.buildContainerInfo(name, container);
                continue;
            }
        }
        return infos;
    }
    /**
     * Log platform info to console
     */
    async logPlatformInfo() {
        const info = await this.getPlatformInfo();
        logger.info('═'.repeat(70));
        logger.info(`Platform Ready! network=${info.network.name}`);
        logger.info('');
        logger.info('For E2E Container (inside Docker network):');
        logger.info(`  BASE_URL:     ${info.e2e.baseUrl}`);
        logger.info(`  KEYCLOAK_URL: ${info.e2e.keycloakUrl}`);
        logger.info(`  Network:      ${info.network.name}`);
        logger.info('');
        logger.info('For Browser/Debugging (from host):');
        logger.info(`  Shell UI:     ${info.external.shellUi}`);
        logger.info(`  Keycloak:     ${info.external.keycloak}`);
        logger.info('═'.repeat(70));
    }
    /**
     * Write platform info to JSON file
     * Always writes to the fixed E2E output directory
     */
    async writePlatformInfoFile(filePath) {
        const info = await this.getPlatformInfo();
        const outputPath = filePath ?? path.join(this.outputDir, 'platform-info.json');
        // Ensure directory exists
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(outputPath, JSON.stringify(info, null, 2));
        logger.info(`Platform info written to: ${outputPath}`);
    }
    /**
     * Export all (log + file)
     */
    async exportAll(filePath) {
        await this.logPlatformInfo();
        await this.writePlatformInfoFile(filePath);
    }
    async buildContainerInfo(containerName, container) {
        // Get internal port from container
        const internalPort = (0, container_utils_1.getInternalPort)(container);
        try {
            const mappedPort = container.getMappedPort(internalPort);
            const host = container.getHost();
            return {
                name: containerName,
                type: 'service',
                host: host,
                port: mappedPort,
                internalPort,
                internalUrl: `http://${containerName}:${internalPort}`,
                externalUrl: `http://${host}:${mappedPort}`,
                running: true,
            };
        }
        catch {
            return {
                name: containerName,
                type: 'service',
                host: '',
                port: 0,
                internalPort,
                internalUrl: `http://${containerName}:${internalPort}`,
                externalUrl: '',
                running: false,
            };
        }
    }
}
exports.PlatformInfoExporter = PlatformInfoExporter;
//# sourceMappingURL=platform-info-exporter.js.map