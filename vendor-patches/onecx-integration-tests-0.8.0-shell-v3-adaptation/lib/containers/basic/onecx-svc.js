"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartedSvcContainer = exports.SvcContainer = void 0;
const tslib_1 = require("tslib");
const testcontainers_1 = require("testcontainers");
const fs = tslib_1.__importStar(require("fs"));
const common_env_utils_1 = require("../../utils/common-env.utils");
const health_check_utils_1 = require("../../utils/health-check.utils");
const health_check_executor_1 = require("../../utils/health-check-executor");
const wait_strategy_utils_1 = require("../../utils/wait-strategy.utils");
const DEFAULT_COMMAND_HEALTH_CHECK = {
    test: ['CMD-SHELL', 'curl --head -fsS http://localhost:8080/q/health'],
    interval: 10_000,
    timeout: 5_000,
    retries: 3,
};
class SvcContainer extends testcontainers_1.GenericContainer {
    services;
    details = {
        databaseUsername: '',
        databasePassword: '',
    };
    shouldCreateDatabase = true;
    loggingEnabled = false;
    logFilePath;
    port = 8080;
    commandHealthCheckConfig;
    healthCheckConfigs = [];
    constructor(image, services) {
        super(image);
        this.services = services;
        this.withExposedPorts(this.port);
    }
    withDatabaseUsername(databaseUsername) {
        this.details.databaseUsername = databaseUsername;
        return this;
    }
    withDatabasePassword(databasePassword) {
        this.details.databasePassword = databasePassword;
        return this;
    }
    withCommandHealthCheck(config) {
        this.commandHealthCheckConfig = config;
        return this;
    }
    withHealthChecks(configs) {
        this.healthCheckConfigs = configs;
        return this;
    }
    getKeycloakContainer() {
        return this.services.keycloakContainer;
    }
    getPostgresContainer() {
        return this.services.databaseContainer;
    }
    validateDatabaseCredentials() {
        if (!this.details.databaseUsername || !this.details.databasePassword) {
            throw new Error('Database credentials must be set using withDatabaseUsername and withDatabasePassword');
        }
    }
    createDatabaseAtStart(shouldStart) {
        this.shouldCreateDatabase = shouldStart;
    }
    withLoggingEnabled(log) {
        this.loggingEnabled = log;
        return this;
    }
    withLogFilePath(filePath) {
        this.logFilePath = filePath;
        return this;
    }
    getFormattedLogLine(line) {
        const timestamp = new Date().toISOString();
        const text = typeof line === 'string' ? line : line.toString();
        return `[${timestamp}] ${text}`;
    }
    writeLogToFile(line, logFilePath) {
        const formatted = this.getFormattedLogLine(line);
        fs.appendFileSync(logFilePath, `${formatted}\n`);
    }
    async start() {
        if (this.shouldCreateDatabase) {
            this.validateDatabaseCredentials();
            await this.services.databaseContainer?.createUserAndDatabase(this.details.databaseUsername, this.details.databasePassword);
        }
        const hasCustomConfig = this.commandHealthCheckConfig !== undefined || this.healthCheckConfigs.length > 0;
        // Use the provided commandHealthCheck, or fall back to the default when nothing is configured
        const effectiveCommandHC = this.commandHealthCheckConfig ?? (hasCustomConfig ? undefined : DEFAULT_COMMAND_HEALTH_CHECK);
        if (effectiveCommandHC) {
            this.withHealthCheck((0, wait_strategy_utils_1.toTestcontainersHealthCheck)(effectiveCommandHC));
        }
        const waitStrategies = (0, wait_strategy_utils_1.buildWaitStrategies)(effectiveCommandHC, this.healthCheckConfigs);
        this.withWaitStrategy(testcontainers_1.Wait.forAll([...waitStrategies]));
        this.withEnvironment({
            ...this.environment,
            QUARKUS_DATASOURCE_USERNAME: this.details.databaseUsername,
            QUARKUS_DATASOURCE_PASSWORD: this.details.databaseUsername,
            QUARKUS_DATASOURCE_JDBC_URL: `jdbc:postgresql://${this.services.databaseContainer?.getNetworkAliases()[0]}:${this.services.databaseContainer?.getPort()}/${this.details.databaseUsername}?sslmode=disable`,
            TKIT_DATAIMPORT_ENABLED: 'true',
            ONECX_TENANT_CACHE_ENABLED: 'false',
        }).withEnvironment((0, common_env_utils_1.getCommonEnvironmentVariables)(this.services.keycloakContainer));
        if (this.logFilePath) {
            this.withLogConsumer((stream) => {
                stream.on('data', (line) => this.writeLogToFile(line, this.logFilePath));
                stream.on('err', (line) => this.writeLogToFile(line, this.logFilePath));
            });
        }
        return new StartedSvcContainer(await super.start(), this.details, this.networkAliases, this.port, effectiveCommandHC, this.healthCheckConfigs);
    }
}
exports.SvcContainer = SvcContainer;
class StartedSvcContainer extends testcontainers_1.AbstractStartedContainer {
    details;
    networkAliases;
    port;
    commandHealthCheck;
    healthCheckConfigs;
    constructor(startedTestContainer, details, networkAliases, port, commandHealthCheck, healthCheckConfigs) {
        super(startedTestContainer);
        this.details = details;
        this.networkAliases = networkAliases;
        this.port = port;
        this.commandHealthCheck = commandHealthCheck;
        this.healthCheckConfigs = healthCheckConfigs;
    }
    getHealthCheckExecutor() {
        if (!this.commandHealthCheck) {
            return new health_check_executor_1.SkipHealthCheckExecutor('No command health check configured');
        }
        const mappedPort = this.getMappedPort(this.port);
        // Build URL from health check configuration
        const endpoint = (0, health_check_utils_1.buildHealthCheckUrl)(mappedPort, this.commandHealthCheck);
        // If no valid URL can be extracted, skip health check
        if (!endpoint) {
            return new health_check_executor_1.SkipHealthCheckExecutor('No valid health check URL could be extracted');
        }
        // Use timeout from health check if available, otherwise default
        const timeout = this.commandHealthCheck?.timeout || 8000;
        return new health_check_executor_1.HttpHealthCheckExecutor(endpoint, timeout, [200, 503]);
    }
    getDatabaseUsername() {
        return this.details.databaseUsername;
    }
    getDatabasePassword() {
        return this.details.databasePassword;
    }
    getPort() {
        return this.port;
    }
    getNetworkAliases() {
        return this.networkAliases;
    }
}
exports.StartedSvcContainer = StartedSvcContainer;
//# sourceMappingURL=onecx-svc.js.map