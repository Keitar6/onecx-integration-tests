"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartedE2eContainer = exports.E2eContainer = void 0;
const tslib_1 = require("tslib");
const testcontainers_1 = require("testcontainers");
const fs = tslib_1.__importStar(require("fs"));
const path = tslib_1.__importStar(require("path"));
const dockerode_1 = tslib_1.__importDefault(require("dockerode"));
const health_check_executor_1 = require("../../utils/health-check-executor");
const e2e_constants_1 = require("../../config/e2e-constants");
const network_alias_utils_1 = require("../../utils/network-alias.utils");
/**
 * E2E test container that runs playwright/cypress tests against the platform.
 * The container is expected to exit with code 0 (success) or 1 (failure).
 * Results are written to a subdirectory named after the container's networkAlias.
 */
class E2eContainer extends testcontainers_1.GenericContainer {
    loggingEnabled = false;
    logFilePath;
    baseUrl = '';
    /**
     * Create an E2E container
     * @param image Resolved Docker image name
     */
    constructor(image) {
        super(image);
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
    withBaseUrl(baseUrl) {
        this.baseUrl = baseUrl;
        return this;
    }
    async start() {
        // Pass BASE_URL environment variable if configured
        if (this.baseUrl) {
            this.withEnvironment({ BASE_URL: this.baseUrl });
        }
        // Mount output directory for E2E results
        // Use networkAlias as subdirectory name
        const networkAlias = this.networkAliases[0];
        if (!networkAlias) {
            throw new Error('E2E container requires at least one network alias');
        }
        (0, network_alias_utils_1.validateNetworkAlias)(networkAlias, 'E2E container');
        const outputPath = path.resolve((0, e2e_constants_1.getE2eOutputPath)(), networkAlias);
        fs.mkdirSync(outputPath, { recursive: true });
        this.withBindMounts([
            {
                source: outputPath,
                target: e2e_constants_1.E2E_CONTAINER_OUTPUT_PATH,
                mode: 'rw',
            },
        ]);
        // Use one-shot wait strategy for containers that exit on their own
        // This waits for the container to stop with exit code 0
        this.withWaitStrategy(testcontainers_1.Wait.forOneShotStartup());
        // Enable logging if configured
        if (this.logFilePath) {
            this.withLogConsumer((stream) => {
                stream.on('data', (line) => this.writeLogToFile(line, this.logFilePath));
                stream.on('err', (line) => this.writeLogToFile(line, this.logFilePath));
            });
        }
        const startedContainer = await super.start();
        return new StartedE2eContainer(startedContainer, this.networkAliases);
    }
}
exports.E2eContainer = E2eContainer;
class StartedE2eContainer extends testcontainers_1.AbstractStartedContainer {
    networkAlias;
    constructor(startedTestContainer, networkAlias) {
        super(startedTestContainer);
        this.networkAlias = networkAlias;
    }
    /**
     * E2E containers don't have health endpoints - skip health check
     */
    getHealthCheckExecutor() {
        return new health_check_executor_1.SkipHealthCheckExecutor('E2E Container');
    }
    /**
     * Get network aliases (for consistency with other containers)
     */
    getNetworkAliases() {
        return this.networkAlias;
    }
    /**
     * Get the exit code from the stopped container
     * Since we use Wait.forOneShotStartup(), the container has already exited when start() completes
     */
    async getExitCode() {
        try {
            const dockerode = new dockerode_1.default();
            const dockerContainer = dockerode.getContainer(this.getId());
            const inspectData = await dockerContainer.inspect();
            return inspectData.State.ExitCode;
        }
        catch {
            return undefined;
        }
    }
}
exports.StartedE2eContainer = StartedE2eContainer;
//# sourceMappingURL=onecx-e2e.js.map