"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartedBffContainer = exports.BffContainer = void 0;
const tslib_1 = require("tslib");
const testcontainers_1 = require("testcontainers");
const fs = tslib_1.__importStar(require("fs"));
const health_check_utils_1 = require("../../utils/health-check.utils");
const health_check_executor_1 = require("../../utils/health-check-executor");
const common_env_utils_1 = require("../../utils/common-env.utils");
const wait_strategy_utils_1 = require("../../utils/wait-strategy.utils");
const DEFAULT_COMMAND_HEALTH_CHECK = (port) => ({
    test: ['CMD-SHELL', `curl --head -fsS http://localhost:${port}/q/health`],
    interval: 10_000,
    timeout: 5_000,
    retries: 3,
});
class BffContainer extends testcontainers_1.GenericContainer {
    keycloakContainer;
    details = {
        permissionsProductName: '',
    };
    port = 8080;
    loggingEnabled = false;
    logFilePath;
    commandHealthCheckConfig;
    healthCheckConfigs = [];
    constructor(image, keycloakContainer) {
        super(image);
        this.keycloakContainer = keycloakContainer;
    }
    withPermissionsProductName(permissionsProductName) {
        this.details.permissionsProductName = permissionsProductName;
        return this;
    }
    withPort(port) {
        this.port = port;
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
        return this.keycloakContainer;
    }
    getPort() {
        return this.port;
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
        const hasCustomConfig = this.commandHealthCheckConfig !== undefined || this.healthCheckConfigs.length > 0;
        // Use the provided commandHealthCheck, or fall back to the default when nothing is configured
        const effectiveCommandHC = this.commandHealthCheckConfig ?? (hasCustomConfig ? undefined : DEFAULT_COMMAND_HEALTH_CHECK(this.port));
        if (effectiveCommandHC) {
            this.withHealthCheck((0, wait_strategy_utils_1.toTestcontainersHealthCheck)(effectiveCommandHC));
        }
        const waitStrategies = (0, wait_strategy_utils_1.buildWaitStrategies)(effectiveCommandHC, this.healthCheckConfigs);
        this.withEnvironment({
            ...this.environment,
            ONECX_PERMISSIONS_PRODUCT_NAME: this.details.permissionsProductName,
        }).withEnvironment((0, common_env_utils_1.getCommonEnvironmentVariables)(this.keycloakContainer));
        if (this.logFilePath) {
            this.withLogConsumer((stream) => {
                stream.on('data', (line) => this.writeLogToFile(line, this.logFilePath));
                stream.on('err', (line) => this.writeLogToFile(line, this.logFilePath));
            });
        }
        this.withExposedPorts(this.port).withWaitStrategy(testcontainers_1.Wait.forAll([...waitStrategies, testcontainers_1.Wait.forListeningPorts()]));
        return new StartedBffContainer(await super.start(), this.details, this.networkAliases, this.port, effectiveCommandHC, this.healthCheckConfigs);
    }
}
exports.BffContainer = BffContainer;
class StartedBffContainer extends testcontainers_1.AbstractStartedContainer {
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
    getPermissionProductName() {
        return this.details.permissionsProductName;
    }
    getNetworkAliases() {
        return this.networkAliases;
    }
    getPort() {
        return this.port;
    }
}
exports.StartedBffContainer = StartedBffContainer;
//# sourceMappingURL=onecx-bff.js.map