"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkipHealthCheckExecutor = exports.HttpHealthCheckExecutor = void 0;
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
/**
 * HTTP-based health check strategy
 * Uses axios with configurable timeout and retry logic
 */
class HttpHealthCheckExecutor {
    endpoint;
    timeout;
    expectedStatusCodes;
    constructor(endpoint, timeout = 5000, expectedStatusCodes = [200]) {
        this.endpoint = endpoint;
        this.timeout = timeout;
        this.expectedStatusCodes = expectedStatusCodes;
    }
    async executeHealthCheck() {
        const startTime = Date.now();
        try {
            const response = await axios_1.default.get(this.endpoint, {
                timeout: this.timeout,
                validateStatus: (status) => this.expectedStatusCodes.includes(status),
            });
            return {
                success: true,
                responseTime: Date.now() - startTime,
                statusCode: response.status,
            };
        }
        catch (error) {
            return {
                success: false,
                responseTime: Date.now() - startTime,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
    getExecutionMetadata() {
        return {
            strategyType: 'HTTP',
            endpoint: this.endpoint,
            timeout: this.timeout,
            description: `HTTP GET ${this.endpoint}`,
        };
    }
}
exports.HttpHealthCheckExecutor = HttpHealthCheckExecutor;
/**
 * No-op strategy for containers without health endpoints
 * Always returns success to avoid false negatives
 */
class SkipHealthCheckExecutor {
    containerName;
    constructor(containerName) {
        this.containerName = containerName;
    }
    async executeHealthCheck() {
        return { success: true };
    }
    getExecutionMetadata() {
        return {
            strategyType: 'SKIP',
            description: `${this.containerName} - No health check required`,
        };
    }
}
exports.SkipHealthCheckExecutor = SkipHealthCheckExecutor;
//# sourceMappingURL=health-check-executor.js.map