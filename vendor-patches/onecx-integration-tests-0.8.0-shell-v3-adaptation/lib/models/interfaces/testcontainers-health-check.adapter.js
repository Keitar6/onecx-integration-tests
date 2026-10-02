"use strict";
/**
 * Adapter interfaces bridging our platform config contract with testcontainers wait strategies.
 *
 * Mapping:
 *   CommandHealthCheckConfig → withHealthCheck() + Wait.forHealthCheck()
 *   HttpHealthCheckConfig    → Wait.forHttp(path, port)
 *   LogHealthCheckConfig     → Wait.forLogMessage(message, times)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHttpHealthCheck = isHttpHealthCheck;
exports.isLogHealthCheck = isLogHealthCheck;
/** Type guard: narrows HealthCheckConfig to HttpHealthCheckConfig */
function isHttpHealthCheck(c) {
    return c.type === 'http';
}
/** Type guard: narrows HealthCheckConfig to LogHealthCheckConfig */
function isLogHealthCheck(c) {
    return c.type === 'log';
}
//# sourceMappingURL=testcontainers-health-check.adapter.js.map