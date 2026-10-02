"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthChecker = void 0;
const logger_1 = require("../utils/logger");
const logger = new logger_1.Logger('HealthChecker');
const DEFAULT_HEARTBEAT_CONFIG = {
    enabled: false,
    interval: 10000, // 10 seconds default
    failureThreshold: 3,
};
class HealthChecker {
    heartbeatInterval;
    failureCountMap = new Map();
    heartbeatConfig = { ...DEFAULT_HEARTBEAT_CONFIG };
    /**
     * Configure heartbeat settings from platform configuration
     */
    configureHeartbeat(config) {
        if (config) {
            this.heartbeatConfig = {
                ...DEFAULT_HEARTBEAT_CONFIG,
                ...config,
            };
            logger.info(`${logger_1.LogMessages.HEALTH_CHECK_START}: Heartbeat configured enabled=${config.enabled}, interval=${this.heartbeatConfig.interval}ms, threshold=${this.heartbeatConfig.failureThreshold}`);
        }
        else {
            this.heartbeatConfig = { ...DEFAULT_HEARTBEAT_CONFIG };
            logger.info(`${logger_1.LogMessages.HEALTH_CHECK_START}: Heartbeat disabled (no configuration provided)`);
        }
    }
    /**
     * Check the health of all containers
     */
    async checkAllHealthy(startedContainers) {
        const healthCheckPromises = Array.from(startedContainers.keys()).map(async (name) => {
            const result = await this.checkHealthy(startedContainers, name);
            return result;
        });
        return Promise.all(healthCheckPromises);
    }
    /**
     * Check the health of one container using the strategy pattern
     */
    async checkHealthy(startedContainers, name) {
        const container = startedContainers.get(name);
        if (!container) {
            throw new Error(`No started container found with name "${name}"`);
        }
        // All containers must implement HealthCheckableContainer interface
        const executor = container.getHealthCheckExecutor();
        const metadata = executor.getExecutionMetadata();
        logger.info(`${logger_1.LogMessages.HEALTH_CHECK_CONTAINER}: ${name} (${metadata.description})`);
        try {
            const result = await executor.executeHealthCheck();
            if (result.success) {
                logger.success(`${logger_1.LogMessages.HEALTH_CHECK_SUCCESS}: ${name} ${result.responseTime ? `(${result.responseTime}ms)` : ''}`);
            }
            else {
                logger.error(`${logger_1.LogMessages.HEALTH_CHECK_FAILED}: ${name} unhealthy: ${result.error || 'Unknown error'}`);
            }
            return { name, healthy: result.success };
        }
        catch (error) {
            logger.error(`${logger_1.LogMessages.HEALTH_CHECK_FAILED}: ${name} health check threw exception`, undefined, error);
            return { name, healthy: false };
        }
    }
    /**
     * Start heartbeat monitoring for containers
     */
    startHeartbeat(startedContainers) {
        if (!this.heartbeatConfig.enabled) {
            logger.info(`${logger_1.LogMessages.HEALTH_CHECK_START}: Heartbeat monitoring is disabled`);
            return;
        }
        if (this.heartbeatInterval) {
            // Stop any existing heartbeat to prevent multiple intervals running
            this.stopHeartbeat();
        }
        logger.info(`${logger_1.LogMessages.HEALTH_CHECK_START}: Starting heartbeat monitoring (interval: ${this.heartbeatConfig.interval}ms)`);
        this.heartbeatInterval = setInterval(async () => {
            try {
                await this.processHeartbeatCheck(startedContainers);
            }
            catch (error) {
                logger.error(`${logger_1.LogMessages.HEALTH_CHECK_FAILED}`, undefined, error);
            }
        }, this.heartbeatConfig.interval);
    }
    /**
     * Stop heartbeat monitoring
     */
    stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = undefined;
            this.failureCountMap.clear();
            logger.info(`${logger_1.LogMessages.HEALTH_CHECK_START}: Heartbeat monitoring stopped`);
        }
    }
    /**
     * Check if heartbeat is currently running
     */
    isHeartbeatRunning() {
        return this.heartbeatInterval !== undefined;
    }
    /**
     * Get current heartbeat configuration
     */
    getHeartbeatConfig() {
        return { ...this.heartbeatConfig };
    }
    /**
     * Process a single heartbeat check cycle
     */
    async processHeartbeatCheck(startedContainers) {
        const healthStatus = await this.checkAllHealthy(startedContainers);
        logger.success(`${logger_1.LogMessages.HEALTH_CHECK_SUCCESS}: Checked ${healthStatus.length} containers`);
        this.processHealthResults(healthStatus);
        this.logHealthSummary(healthStatus);
    }
    /**
     * Process health check results and track failure counts
     */
    processHealthResults(healthStatus) {
        for (const container of healthStatus) {
            if (container.healthy) {
                // Reset failure count for healthy containers
                this.failureCountMap.delete(container.name);
            }
            else {
                // Increment failure count
                const currentFailures = this.failureCountMap.get(container.name) || 0;
                this.failureCountMap.set(container.name, currentFailures + 1);
                // Log error if threshold exceeded
                const failures = this.failureCountMap.get(container.name) || 0;
                if (failures >= this.heartbeatConfig.failureThreshold) {
                    logger.error(`${logger_1.LogMessages.CONTAINER_UNHEALTHY}: ${container.name} unhealthy (${failures} consecutive failures)`);
                }
                else if (failures === 1) {
                    logger.warn(`${logger_1.LogMessages.CONTAINER_UNHEALTHY}: ${container.name} unhealthy (first failure)`);
                }
            }
        }
    }
    /**
     * Log summary of unhealthy containers
     */
    logHealthSummary(healthStatus) {
        const unhealthyContainers = healthStatus.filter((c) => !c.healthy);
        if (unhealthyContainers.length > 0) {
            const summary = `${unhealthyContainers.length} containers unhealthy: ${unhealthyContainers
                .map((c) => c.name)
                .join(', ')}`;
            logger.error(`${logger_1.LogMessages.CONTAINER_UNHEALTHY}: ${summary}`);
        }
    }
}
exports.HealthChecker = HealthChecker;
//# sourceMappingURL=health-checker.js.map