"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformManager = void 0;
const testcontainers_1 = require("testcontainers");
const container_enum_1 = require("../models/enums/container.enum");
const image_resolver_1 = require("./image-resolver");
const health_checker_1 = require("./health-checker");
const core_container_starter_1 = require("./core-container-starter");
const user_defined_container_starter_1 = require("./user-defined-container-starter");
const data_importer_1 = require("./data-importer");
const logger_1 = require("../utils/logger");
const json_validator_1 = require("./json-validator");
const container_registry_1 = require("./container-registry");
const platform_info_exporter_1 = require("./platform-info-exporter");
const default_platform_config_1 = require("../config/default-platform-config");
const logger = new logger_1.Logger('PlatformManager');
class PlatformManager {
    /**
     * Container registry for managing all containers
     */
    containerRegistry = new container_registry_1.ContainerRegistry();
    /**
     * Optional provider for container log file paths
     */
    logFilePathProvider;
    /**
     * Needed classes for startContainers
     */
    network;
    imageResolver;
    CoreContainerStarter;
    UserDefinedContainerStarter;
    dataImporter;
    healthChecker;
    jsonValidator;
    validatedConfig;
    platformInfoExporter;
    constructor(configFilePath, logFilePathProvider) {
        this.jsonValidator = new json_validator_1.PlatformConfigJsonValidator();
        this.logFilePathProvider = logFilePathProvider;
        this.initializeConfiguration(configFilePath);
    }
    /**
     * Set the log file path provider
     */
    setLogFilePathProvider(provider) {
        this.logFilePathProvider = provider;
    }
    /**
     * Orchestrates the startup of the default services and the creation of user-defined containers.
     * @param config Optional config override. If not provided, uses validated config from constructor
     */
    async startContainers(config) {
        // Use validated config from constructor if available, otherwise use provided config or default
        const finalConfig = config || this.validatedConfig || default_platform_config_1.DEFAULT_PLATFORM_CONFIG;
        logger.info(logger_1.LogMessages.PLATFORM_MANAGER_INIT);
        this.healthChecker = new health_checker_1.HealthChecker();
        // Configure heartbeat from platform config
        this.healthChecker.configureHeartbeat(finalConfig.heartbeat);
        this.imageResolver = new image_resolver_1.ImageResolver();
        this.dataImporter = new data_importer_1.DataImporter(this.imageResolver, this.logFilePathProvider);
        logger.info(logger_1.LogMessages.NETWORK_CREATE);
        this.network = await new testcontainers_1.Network().start();
        logger.success(logger_1.LogMessages.NETWORK_CREATED);
        this.CoreContainerStarter = new core_container_starter_1.CoreContainerStarter(this.imageResolver, this.network, this.containerRegistry, finalConfig, this.logFilePathProvider);
        logger.info(logger_1.LogMessages.PLATFORM_START);
        // Always start core services first
        await this.CoreContainerStarter.startCoreContainers();
        const postgres = this.containerRegistry.getContainer(container_enum_1.CONTAINER.POSTGRES);
        const keycloak = this.containerRegistry.getContainer(container_enum_1.CONTAINER.KEYCLOAK);
        await this.CoreContainerStarter.startServiceContainers(postgres, keycloak);
        // Start BFF containers based on configuration
        await this.CoreContainerStarter.startBffContainers(keycloak);
        // Start UI containers based on configuration
        await this.CoreContainerStarter.startUiContainers(keycloak);
        // Create user-defined containers if defined in configuration
        if (finalConfig.container) {
            // Initialize container factory with core services
            this.UserDefinedContainerStarter = new user_defined_container_starter_1.UserDefinedContainerStarter(this.network, this.imageResolver, this.containerRegistry, postgres, keycloak, this.logFilePathProvider);
            await this.createContainers(finalConfig);
        }
        // Import data if configured
        if (finalConfig.importData && this.dataImporter) {
            this.dataImporter.createContainerInfo(this.containerRegistry.getAllContainers());
            await this.dataImporter.importDefaultData(this.network, this.containerRegistry.getAllContainers(), finalConfig);
        }
        logger.success(logger_1.LogMessages.PLATFORM_READY);
        // Start heartbeat monitoring if configured
        this.healthChecker.startHeartbeat(this.containerRegistry.getAllContainers());
        // Initialize exporter after all containers are started
        this.platformInfoExporter = new platform_info_exporter_1.PlatformInfoExporter(this.containerRegistry, this.network);
    }
    /**
     * Get the validated configuration
     */
    getValidatedConfig() {
        return this.validatedConfig;
    }
    /**
     * Check if a valid configuration file was found and loaded
     */
    hasValidatedConfig() {
        return this.validatedConfig !== undefined;
    }
    /**
     * Get the JSON validator instance
     */
    getJsonValidator() {
        return this.jsonValidator;
    }
    /**
     * Check the health of all running containers
     */
    async checkAllHealthy() {
        if (!this.healthChecker) {
            throw new Error('HealthChecker not initialized. Call startContainers first.');
        }
        return await this.healthChecker.checkAllHealthy(this.containerRegistry.getAllContainers());
    }
    /**
     * Check the health of one runnting contianer
     * @param containerName
     * @returns
     */
    async checkHealthy(containerName) {
        if (!this.healthChecker) {
            throw new Error('HealthChecker not initialized. Call startContainers first.');
        }
        return await this.healthChecker.checkHealthy(this.containerRegistry.getAllContainers(), containerName);
    }
    /**
     * Check if heartbeat monitoring is currently running
     */
    isHeartbeatRunning() {
        return this.healthChecker?.isHeartbeatRunning() || false;
    }
    /**
     * Get the current heartbeat configuration
     */
    getHeartbeatConfig() {
        return this.healthChecker?.getHeartbeatConfig();
    }
    /**
     * Start heartbeat monitoring manually
     */
    startHeartbeat() {
        if (!this.healthChecker) {
            throw new Error('HealthChecker not initialized. Call startContainers first.');
        }
        this.healthChecker.startHeartbeat(this.containerRegistry.getAllContainers());
    }
    /**
     * Stop heartbeat monitoring manually
     */
    stopHeartbeat() {
        if (this.healthChecker) {
            this.healthChecker.stopHeartbeat();
        }
    }
    /**
     * Get all containers (standard and custom)
     */
    getAllContainers() {
        return this.containerRegistry.getAllContainers();
    }
    /**
     * Get a container by key (works for both standard and custom)
     */
    getContainer(key) {
        return this.containerRegistry.getContainer(key);
    }
    /**
     * Check if a container exists
     */
    hasContainer(key) {
        return this.containerRegistry.hasContainer(key);
    }
    /**
     * Remove a container
     */
    removeContainer(key) {
        this.stopContainer(key);
        return this.containerRegistry.removeContainer(key);
    }
    /**
     * Stop all running services and cleanup resources
     */
    async stopAllContainers() {
        logger.info(logger_1.LogMessages.PLATFORM_STOP);
        // Stop heartbeat monitoring first
        if (this.healthChecker) {
            this.healthChecker.stopHeartbeat();
        }
        // Stop standard containers
        // Since all services depend on Postgres and Keycloak, it's best to stop these last.
        // The same applies to the Shell, as the UI depends on the BFF.
        // Since the startup order is important, the containers can be stopped in the reverse order.
        const standardContainers = this.getAllContainers();
        const containers = Array.from(standardContainers.values()).reverse();
        for (const container of containers) {
            try {
                await container.stop();
            }
            catch (error) {
                logger.error(logger_1.LogMessages.CONTAINER_FAILED, container.constructor.name, error);
                // Don't throw here, continue stopping other containers
            }
        }
        // Cleanup network
        if (this.network) {
            try {
                logger.info(logger_1.LogMessages.NETWORK_DESTROY);
                await this.network.stop();
                logger.success(logger_1.LogMessages.NETWORK_DESTROYED);
                this.network = undefined;
            }
            catch (error) {
                logger.error(logger_1.LogMessages.NETWORK_DESTROY, 'Network cleanup failed', error);
                // Don't throw here, network might already be destroyed
                this.network = undefined;
            }
        }
        logger.success(logger_1.LogMessages.PLATFORM_SHUTDOWN);
        this.containerRegistry.clear();
    }
    /**
     * Get platform info exporter for URL access
     */
    getInfoExporter() {
        return this.platformInfoExporter;
    }
    /**
     * Get platform info (convenience method)
     */
    async getPlatformInfo() {
        return await this.platformInfoExporter?.getPlatformInfo();
    }
    /**
     * Export runtime platform metadata to artifacts.
     */
    async exportPlatformInfo() {
        await this.platformInfoExporter?.exportAll();
    }
    /**
     * Check if E2E tests are configured
     */
    hasE2eConfig() {
        const config = this.validatedConfig || default_platform_config_1.DEFAULT_PLATFORM_CONFIG;
        return (config.container?.e2e?.length ?? 0) > 0;
    }
    /**
     * Run E2E tests if configured
     * This should be called after all containers are healthy.
     * E2E container failures are logged and execution continues.
     * @returns Ordered E2E execution records, or undefined if no E2E configured
     */
    async startE2eContainers(shouldStop) {
        const config = this.validatedConfig || default_platform_config_1.DEFAULT_PLATFORM_CONFIG;
        if (!config.container?.e2e) {
            return undefined;
        }
        if (!this.UserDefinedContainerStarter) {
            // Initialize UserDefinedContainerStarter if not already done
            if (!this.network || !this.imageResolver) {
                throw new Error('Network and ImageResolver must be initialized before running E2E tests');
            }
            const postgres = this.containerRegistry.getContainer(container_enum_1.CONTAINER.POSTGRES);
            const keycloak = this.containerRegistry.getContainer(container_enum_1.CONTAINER.KEYCLOAK);
            this.UserDefinedContainerStarter = new user_defined_container_starter_1.UserDefinedContainerStarter(this.network, this.imageResolver, this.containerRegistry, postgres, keycloak, this.logFilePathProvider);
        }
        return await this.UserDefinedContainerStarter.startE2eContainers(config, shouldStop);
    }
    /**
     * Create user-defined containers using the UserDefinedContainerStarter
     */
    async createContainers(config) {
        if (!this.UserDefinedContainerStarter) {
            throw new Error('UserDefinedContainerStarter not initialized. Core services must be started first.');
        }
        try {
            await this.UserDefinedContainerStarter.createAndStartContainers(config);
            logger.info(`${logger_1.LogMessages.CONTAINER_STARTED}: User-defined containers created successfully`);
        }
        catch (error) {
            logger.error(`${logger_1.LogMessages.CONTAINER_FAILED}: User-defined containers`, undefined, error);
            throw error;
        }
    }
    /**
     * Initialize and validate the platform configuration
     */
    initializeConfiguration(configFilePath) {
        // Validate configuration file if it exists
        const validationResult = this.jsonValidator.validateConfigFile(configFilePath);
        if (validationResult.isValid && validationResult.config) {
            this.validatedConfig = validationResult.config;
            logger.success(logger_1.LogMessages.CONFIG_FOUND, 'Configuration loaded and validated successfully');
        }
        else if (validationResult.errors && validationResult.errors.length > 0) {
            logger.warn(logger_1.LogMessages.CONFIG_VALIDATION_WARN, `Configuration validation failed: ${validationResult.errors.join(', ')}`);
            logger.info(logger_1.LogMessages.CONFIG_NOT_FOUND, 'No valid platform configuration found');
        }
        else {
            logger.info(logger_1.LogMessages.CONFIG_NOT_FOUND, 'No configuration file found');
        }
    }
    /**
     * Stop a container
     * @param key
     */
    async stopContainer(key) {
        const container = this.getContainer(key);
        const containerKey = typeof key === 'string' ? key : String(key);
        try {
            await container?.stop();
            logger.success(logger_1.LogMessages.CONTAINER_STOPPED, containerKey);
        }
        catch (error) {
            logger.error(logger_1.LogMessages.CONTAINER_FAILED, containerKey, error);
            throw error;
        }
    }
}
exports.PlatformManager = PlatformManager;
//# sourceMappingURL=platform-manager.js.map