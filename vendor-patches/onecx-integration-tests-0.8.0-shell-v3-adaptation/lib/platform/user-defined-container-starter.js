"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDefinedContainerStarter = void 0;
const e2e_execution_handler_1 = require("../utils/e2e-execution.handler");
const onecx_svc_1 = require("../containers/basic/onecx-svc");
const onecx_bff_1 = require("../containers/basic/onecx-bff");
const onecx_ui_1 = require("../containers/basic/onecx-ui");
const onecx_e2e_1 = require("../containers/e2e/onecx-e2e");
const logging_enable_1 = require("../utils/logging-enable");
const logger_1 = require("../utils/logger");
const e2e_constants_1 = require("../config/e2e-constants");
const network_alias_utils_1 = require("../utils/network-alias.utils");
const logger = new logger_1.Logger('UserDefinedContainerStarter');
/**
 * UserDefinedContainerStarter class for creating different types of containers based on configuration
 */
class UserDefinedContainerStarter {
    network;
    imageResolver;
    containerRegistry;
    postgres;
    keycloak;
    logFilePathProvider;
    e2eExecutionHandler = new e2e_execution_handler_1.E2eExecutionHandler();
    constructor(network, imageResolver, containerRegistry, postgres, keycloak, logFilePathProvider) {
        this.network = network;
        this.imageResolver = imageResolver;
        this.containerRegistry = containerRegistry;
        this.postgres = postgres;
        this.keycloak = keycloak;
        this.logFilePathProvider = logFilePathProvider;
    }
    /**
     * Create containers based on the platform configuration
     * @param config Platform configuration containing container definitions
     * @returns Map of created and started containers
     */
    async createAndStartContainers(config) {
        if (!config.container) {
            return;
        }
        logger.info(logger_1.LogMessages.CONTAINER_STARTED, 'Creating user-defined containers');
        // Create service containers
        if (config.container.service && config.container.service.length > 0) {
            for (const serviceConfig of config.container.service) {
                (0, network_alias_utils_1.validateNetworkAlias)(serviceConfig.networkAlias, 'Service container');
                logger.info(logger_1.LogMessages.CONTAINER_STARTED, `Creating service container: ${serviceConfig.networkAlias}`);
                const svcContainer = await this.createSvcContainer(serviceConfig, (0, logging_enable_1.loggingEnabled)(config, [serviceConfig.networkAlias]), this.logFilePathProvider?.(serviceConfig.networkAlias));
                this.containerRegistry.addContainer(serviceConfig.networkAlias, svcContainer);
                logger.success(logger_1.LogMessages.CONTAINER_STARTED, `Service container created: ${serviceConfig.networkAlias}`);
            }
        }
        // Create BFF containers
        if (config.container.bff && config.container.bff.length > 0) {
            for (const bffConfig of config.container.bff) {
                (0, network_alias_utils_1.validateNetworkAlias)(bffConfig.networkAlias, 'BFF container');
                logger.info(logger_1.LogMessages.CONTAINER_STARTED, `Creating BFF container: ${bffConfig.networkAlias}`);
                const bffContainer = await this.createBffContainer(bffConfig, (0, logging_enable_1.loggingEnabled)(config, [bffConfig.networkAlias]), this.logFilePathProvider?.(bffConfig.networkAlias));
                this.containerRegistry.addContainer(bffConfig.networkAlias, bffContainer);
                logger.success(logger_1.LogMessages.CONTAINER_STARTED, `BFF container created: ${bffConfig.networkAlias}`);
            }
        }
        // Create UI containers
        if (config.container.ui && config.container.ui.length > 0) {
            for (const uiConfig of config.container.ui) {
                (0, network_alias_utils_1.validateNetworkAlias)(uiConfig.networkAlias, 'UI container');
                logger.info(logger_1.LogMessages.CONTAINER_STARTED, `Creating UI container: ${uiConfig.networkAlias}`);
                const uiContainer = await this.createUiContainer(uiConfig, (0, logging_enable_1.loggingEnabled)(config, [uiConfig.networkAlias]), this.logFilePathProvider?.(uiConfig.networkAlias));
                this.containerRegistry.addContainer(uiConfig.networkAlias, uiContainer);
                logger.success(logger_1.LogMessages.CONTAINER_STARTED, `UI container created: ${uiConfig.networkAlias}`);
            }
        }
    }
    /**
     * Run E2E tests in configured order after the platform is healthy.
     * Failures in E2E containers are logged and execution continues with the next container.
     * @param config Platform configuration containing E2E container definitions
     * @returns Ordered E2E execution records, or undefined if no E2E is configured
     */
    async startE2eContainers(config, shouldStop) {
        const validationResult = this.validateE2eConfig(config);
        if (validationResult === null) {
            return undefined;
        }
        if (validationResult === 'empty') {
            return [];
        }
        return await this.executeE2eSequence(config, validationResult, shouldStop);
    }
    /**
     * Validate E2E configuration
     * @returns null if no e2e config, 'empty' if empty array, or the e2e configs array if valid
     */
    validateE2eConfig(config) {
        const e2eConfigs = config.container?.e2e;
        if (!e2eConfigs) {
            return null;
        }
        if (e2eConfigs.length === 0) {
            logger.warn(logger_1.LogMessages.CONTAINER_STARTED, 'E2E configuration is present but empty; skipping E2E execution');
            return 'empty';
        }
        return e2eConfigs;
    }
    /**
     * Execute E2E containers in sequence. Each failure is logged and execution continues.
     */
    async executeE2eSequence(config, e2eConfigs, shouldStop) {
        const total = e2eConfigs.length;
        const results = [];
        for (let index = 0; index < total; index++) {
            if (shouldStop?.()) {
                logger.warn(logger_1.LogMessages.CONTAINER_STARTED, 'Stopping E2E sequence after interruption');
                break;
            }
            const e2eConfig = e2eConfigs[index];
            (0, network_alias_utils_1.validateNetworkAlias)(e2eConfig.networkAlias, 'E2E container');
            logger.info(logger_1.LogMessages.CONTAINER_STARTED, `Starting E2E container ${index + 1}/${total}: ${e2eConfig.networkAlias}`);
            const e2eResult = await this.createE2eContainer({
                e2eConfig,
                withLoggingEnabled: (0, logging_enable_1.loggingEnabled)(config, [e2eConfig.networkAlias]),
                logFilePath: this.logFilePathProvider?.(e2eConfig.networkAlias),
                sequence: index + 1,
                total,
            });
            results.push(e2eResult);
            this.logE2eResult(e2eResult, index, total);
        }
        return results;
    }
    /**
     * Log E2E container execution result
     */
    logE2eResult(result, index, total) {
        const statusMessage = `E2E container finished ${result.sequence}/${total}: ${result.networkAlias} [${result.status}]`;
        if (result.success) {
            logger.success(logger_1.LogMessages.CONTAINER_STARTED, statusMessage);
        }
        else {
            logger.error(logger_1.LogMessages.CONTAINER_FAILED, statusMessage);
        }
    }
    /**
     * Create a service container from the configuration
     */
    async createSvcContainer(svcConfig, withLoggingEnabled, logFilePath) {
        if (!this.postgres || !this.keycloak) {
            throw new Error('Postgres and Keycloak containers are required for service containers');
        }
        // Resolve the image through the ImageResolver
        const resolvedImage = await this.imageResolver.getImage(svcConfig.image);
        const svcContainer = new onecx_svc_1.SvcContainer(resolvedImage, {
            databaseContainer: this.postgres,
            keycloakContainer: this.keycloak,
        }).withNetworkAliases(svcConfig.networkAlias);
        if (svcConfig.environments) {
            svcContainer.withEnvironment(svcConfig.environments);
        }
        if (svcConfig.svcDetails.databaseUsername && svcConfig.svcDetails.databasePassword) {
            svcContainer
                .withDatabaseUsername(svcConfig.svcDetails.databaseUsername)
                .withDatabasePassword(svcConfig.svcDetails.databasePassword);
        }
        if (svcConfig.commandHealthCheck) {
            svcContainer.withCommandHealthCheck(svcConfig.commandHealthCheck);
        }
        if (svcConfig.healthChecks?.length) {
            svcContainer.withHealthChecks(svcConfig.healthChecks);
        }
        if (logFilePath) {
            svcContainer.withLogFilePath(logFilePath);
        }
        return await svcContainer.withLoggingEnabled(withLoggingEnabled).withNetwork(this.network).start();
    }
    /**
     * Create a BFF container from the configuration
     */
    async createBffContainer(bffConfig, withLoggingEnabled, logFilePath) {
        if (!this.keycloak) {
            throw new Error('Keycloak container is required for BFF containers but was not provided.');
        }
        // Resolve the image through the ImageResolver
        const resolvedImage = await this.imageResolver.getImage(bffConfig.image);
        const bffContainer = new onecx_bff_1.BffContainer(resolvedImage, this.keycloak).withNetworkAliases(bffConfig.networkAlias);
        if (bffConfig.bffDetails.permissionsProductName) {
            bffContainer.withPermissionsProductName(bffConfig.bffDetails.permissionsProductName);
        }
        if (bffConfig.commandHealthCheck) {
            bffContainer.withCommandHealthCheck(bffConfig.commandHealthCheck);
        }
        if (bffConfig.healthChecks?.length) {
            bffContainer.withHealthChecks(bffConfig.healthChecks);
        }
        if (bffConfig.environments) {
            bffContainer.withEnvironment(bffConfig.environments);
        }
        if (logFilePath) {
            bffContainer.withLogFilePath(logFilePath);
        }
        return await bffContainer.withLoggingEnabled(withLoggingEnabled).withNetwork(this.network).start();
    }
    /**
     * Create a UI container from the configuration
     */
    async createUiContainer(uiConfig, withLoggingEnabled, logFilePath) {
        // Resolve the image through the ImageResolver
        const resolvedImage = await this.imageResolver.getImage(uiConfig.image);
        const uiContainer = new onecx_ui_1.UiContainer(resolvedImage).withNetworkAliases(uiConfig.networkAlias);
        if (uiConfig.uiDetails.appBaseHref) {
            uiContainer.withAppBaseHref(uiConfig.uiDetails.appBaseHref);
        }
        if (uiConfig.uiDetails.appId) {
            uiContainer.withAppId(uiConfig.uiDetails.appId);
        }
        if (uiConfig.uiDetails.productName) {
            uiContainer.withProductName(uiConfig.uiDetails.productName);
        }
        if (uiConfig.environments) {
            uiContainer.withEnvironment(uiConfig.environments);
        }
        if (uiConfig.commandHealthCheck) {
            uiContainer.withCommandHealthCheck(uiConfig.commandHealthCheck);
        }
        if (uiConfig.healthChecks?.length) {
            uiContainer.withHealthChecks(uiConfig.healthChecks);
        }
        if (logFilePath) {
            uiContainer.withLogFilePath(logFilePath);
        }
        return await uiContainer.withLoggingEnabled(withLoggingEnabled).withNetwork(this.network).start();
    }
    /**
     * Start E2E test container and wait for it to complete.
     * Captures both successful and failed executions for reporting.
     * @param e2eConfig E2E container configuration
     * @param withLoggingEnabled Whether to enable container logging
     * @returns E2E execution result for one configured container
     */
    async createE2eContainer(context) {
        const startedAt = new Date().toISOString();
        const startTime = Date.now();
        return await this.e2eExecutionHandler.executeWithErrorHandling(async () => {
            try {
                return await this.runE2eContainerWithResult(context, startedAt, startTime);
            }
            catch (error) {
                if (error instanceof e2e_execution_handler_1.E2eExecutionError) {
                    throw error;
                }
                throw new e2e_execution_handler_1.E2eExecutionError('failed_startup', error);
            }
        }, (error) => this.e2eExecutionHandler.createFailedRecord(context, startedAt, Date.now() - startTime, error));
    }
    /**
     * Run E2E container and determine result from exit code
     */
    async runE2eContainerWithResult(context, startedAt, startTime) {
        const { e2eConfig } = context;
        const startupTimeoutMs = e2eConfig.timeoutMs ?? e2e_constants_1.E2E_DEFAULT_TIMEOUT_MS;
        const resolvedImage = await this.imageResolver.getImage(e2eConfig.image);
        const e2eContainer = this.configureE2eContainer(new onecx_e2e_1.E2eContainer(resolvedImage), context, startupTimeoutMs);
        const startedContainer = await e2eContainer.start();
        logger.info(logger_1.LogMessages.CONTAINER_STARTED, 'E2E container finished, retrieving exit code...');
        const exitCode = await startedContainer.getExitCode();
        const duration = Date.now() - startTime;
        const finishedAt = new Date().toISOString();
        return this.e2eExecutionHandler.createExecutionRecord(e2eConfig, context.sequence, context.total, startedAt, finishedAt, duration, exitCode);
    }
    /**
     * Configure E2E container with all settings from config
     */
    configureE2eContainer(e2eContainer, context, startupTimeoutMs) {
        const { e2eConfig, withLoggingEnabled, logFilePath } = context;
        e2eContainer.withNetworkAliases(e2eConfig.networkAlias);
        if (e2eConfig.baseUrl) {
            e2eContainer.withBaseUrl(e2eConfig.baseUrl);
        }
        if (e2eConfig.environments) {
            e2eContainer.withEnvironment(e2eConfig.environments);
        }
        if (logFilePath) {
            e2eContainer.withLogFilePath(logFilePath);
        }
        return e2eContainer
            .withLoggingEnabled(withLoggingEnabled)
            .withNetwork(this.network)
            .withStartupTimeout(startupTimeoutMs);
    }
}
exports.UserDefinedContainerStarter = UserDefinedContainerStarter;
//# sourceMappingURL=user-defined-container-starter.js.map