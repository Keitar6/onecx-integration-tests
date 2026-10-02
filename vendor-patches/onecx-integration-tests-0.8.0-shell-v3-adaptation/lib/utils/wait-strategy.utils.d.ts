import { WaitStrategy } from 'testcontainers';
import { HealthCheck } from 'testcontainers/build/types';
import { CommandHealthCheckConfig, HealthCheckConfig, HttpHealthCheckConfig, LogHealthCheckConfig } from '../models/interfaces/testcontainers-health-check.adapter';
/**
 * Convert our CommandHealthCheckConfig to testcontainers HealthCheck type
 * for use with GenericContainer.withHealthCheck()
 */
export declare function toTestcontainersHealthCheck(config: CommandHealthCheckConfig): HealthCheck;
/**
 * Build a testcontainers HttpWaitStrategy from an HttpHealthCheckConfig.
 */
export declare function buildHttpWaitStrategy(config: HttpHealthCheckConfig): WaitStrategy;
/**
 * Build a testcontainers log WaitStrategy from a LogHealthCheckConfig.
 */
export declare function buildLogWaitStrategy(config: LogHealthCheckConfig): WaitStrategy;
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
export declare function buildWaitStrategies(commandHealthCheck: CommandHealthCheckConfig | undefined, healthChecks: HealthCheckConfig[]): WaitStrategy[];
