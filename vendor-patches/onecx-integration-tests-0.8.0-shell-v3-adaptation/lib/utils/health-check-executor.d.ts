import { HealthCheckResult, HealthCheckExecutor, HealthCheckMetadata } from '../models/interfaces/health-check-executor.interface';
/**
 * HTTP-based health check strategy
 * Uses axios with configurable timeout and retry logic
 */
export declare class HttpHealthCheckExecutor implements HealthCheckExecutor {
    private readonly endpoint;
    private readonly timeout;
    private readonly expectedStatusCodes;
    constructor(endpoint: string, timeout?: number, expectedStatusCodes?: number[]);
    executeHealthCheck(): Promise<HealthCheckResult>;
    getExecutionMetadata(): HealthCheckMetadata;
}
/**
 * No-op strategy for containers without health endpoints
 * Always returns success to avoid false negatives
 */
export declare class SkipHealthCheckExecutor implements HealthCheckExecutor {
    private readonly containerName;
    constructor(containerName: string);
    executeHealthCheck(): Promise<HealthCheckResult>;
    getExecutionMetadata(): HealthCheckMetadata;
}
