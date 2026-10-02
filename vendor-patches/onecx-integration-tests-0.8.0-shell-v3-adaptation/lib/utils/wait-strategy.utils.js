"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTestcontainersHealthCheck = toTestcontainersHealthCheck;
exports.buildHttpWaitStrategy = buildHttpWaitStrategy;
exports.buildLogWaitStrategy = buildLogWaitStrategy;
exports.buildWaitStrategies = buildWaitStrategies;
const testcontainers_1 = require("testcontainers");
const testcontainers_health_check_adapter_1 = require("../models/interfaces/testcontainers-health-check.adapter");
/**
 * Convert our CommandHealthCheckConfig to testcontainers HealthCheck type
 * for use with GenericContainer.withHealthCheck()
 */
function toTestcontainersHealthCheck(config) {
    return {
        // Cast is safe: our interface documents the same CMD-SHELL / CMD convention
        test: config.test,
        interval: config.interval,
        timeout: config.timeout,
        retries: config.retries,
    };
}
/**
 * Parse a string value as a RegExp if it matches /pattern/flags syntax, otherwise return as-is.
 */
function parseMessageOrRegex(value) {
    const regexMatch = value.match(/^\/(.+)\/([gimsuy]*)$/);
    if (regexMatch) {
        return new RegExp(regexMatch[1], regexMatch[2]);
    }
    return value;
}
/**
 * Build a testcontainers HttpWaitStrategy from an HttpHealthCheckConfig.
 */
function buildHttpWaitStrategy(config) {
    let strategy = testcontainers_1.Wait.forHttp(config.path, config.port, {
        abortOnContainerExit: config.abortOnContainerExit,
    });
    if (config.statusCode !== undefined) {
        strategy = strategy.forStatusCode(config.statusCode);
    }
    if (config.body !== undefined) {
        const expectedBody = config.body;
        strategy = strategy.forResponsePredicate((body) => body.includes(expectedBody));
    }
    if (config.tls) {
        strategy = strategy.usingTls();
    }
    if (config.method) {
        strategy = strategy.withMethod(config.method);
    }
    if (config.headers) {
        strategy = strategy.withHeaders(config.headers);
    }
    if (config.username !== undefined && config.password !== undefined) {
        strategy = strategy.withBasicCredentials(config.username, config.password);
    }
    if (config.startupTimeout !== undefined) {
        strategy = strategy.withStartupTimeout(config.startupTimeout);
    }
    return strategy;
}
/**
 * Build a testcontainers log WaitStrategy from a LogHealthCheckConfig.
 */
function buildLogWaitStrategy(config) {
    const message = parseMessageOrRegex(config.messageOrRegex);
    const strategy = testcontainers_1.Wait.forLogMessage(message, config.numberOfEntries ?? 1);
    if (config.startupTimeout !== undefined) {
        strategy.withStartupTimeout(config.startupTimeout);
    }
    return strategy;
}
/**
 * Build the full list of testcontainers WaitStrategies from the health check configuration.
 *
 * Mapping:
 *   commandHealthCheck present  → Wait.forHealthCheck()
 *   HttpHealthCheckConfig entry → Wait.forHttp(path, port)
 *   LogHealthCheckConfig entry  → Wait.forLogMessage(message, times)
 *
 * Returns an empty array when no config is provided — callers should apply their own default.
 */
function buildWaitStrategies(commandHealthCheck, healthChecks) {
    const strategies = [];
    let shouldIncludeListeningPorts = true;
    if (commandHealthCheck) {
        strategies.push(testcontainers_1.Wait.forHealthCheck());
    }
    for (const check of healthChecks) {
        if ((0, testcontainers_health_check_adapter_1.isHttpHealthCheck)(check)) {
            strategies.push(buildHttpWaitStrategy(check));
            shouldIncludeListeningPorts = false;
        }
        else if ((0, testcontainers_health_check_adapter_1.isLogHealthCheck)(check)) {
            strategies.push(buildLogWaitStrategy(check));
        }
    }
    if (shouldIncludeListeningPorts)
        strategies.push(testcontainers_1.Wait.forListeningPorts());
    return strategies;
}
//# sourceMappingURL=wait-strategy.utils.js.map