import { GenericContainer, StartedTestContainer, AbstractStartedContainer } from 'testcontainers';
import { HealthCheckableContainer } from '../../models/interfaces/health-checkable-container.interface';
import { HealthCheckExecutor } from '../../models/interfaces/health-check-executor.interface';
/**
 * E2E test container that runs playwright/cypress tests against the platform.
 * The container is expected to exit with code 0 (success) or 1 (failure).
 * Results are written to a subdirectory named after the container's networkAlias.
 */
export declare class E2eContainer extends GenericContainer {
    protected loggingEnabled: boolean;
    protected logFilePath?: string;
    private baseUrl;
    /**
     * Create an E2E container
     * @param image Resolved Docker image name
     */
    constructor(image: string);
    withLoggingEnabled(log: boolean): this;
    withLogFilePath(filePath: string): this;
    protected getFormattedLogLine(line: string | Buffer): string;
    protected writeLogToFile(line: string | Buffer, logFilePath: string): void;
    withBaseUrl(baseUrl: string): this;
    start(): Promise<StartedE2eContainer>;
}
export declare class StartedE2eContainer extends AbstractStartedContainer implements HealthCheckableContainer {
    private readonly networkAlias;
    constructor(startedTestContainer: StartedTestContainer, networkAlias: string[]);
    /**
     * E2E containers don't have health endpoints - skip health check
     */
    getHealthCheckExecutor(): HealthCheckExecutor;
    /**
     * Get network aliases (for consistency with other containers)
     */
    getNetworkAliases(): string[];
    /**
     * Get the exit code from the stopped container
     * Since we use Wait.forOneShotStartup(), the container has already exited when start() completes
     */
    getExitCode(): Promise<number | undefined>;
}
