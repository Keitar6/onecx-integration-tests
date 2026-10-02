import { AbstractStartedContainer, GenericContainer, StartedTestContainer } from 'testcontainers';
import { HealthCheckableContainer } from '../../models/interfaces/health-checkable-container.interface';
import { HealthCheckExecutor } from '../../models/interfaces/health-check-executor.interface';
import { PlatformConfig } from 'src/lib/models';
export declare class ImportManagerContainer extends GenericContainer {
    private readonly containerInfoPath;
    private readonly platformConfig;
    private containerName;
    private importScript;
    protected loggingEnabled: boolean;
    protected logFilePath?: string;
    constructor(image: string, containerInfoPath: string, platformConfig: PlatformConfig);
    withContainerName(containerName: string): this;
    withImportScript(scriptName: string): this;
    withLoggingEnabled(log: boolean): this;
    withLogFilePath(filePath: string): this;
    protected getFormattedLogLine(line: string | Buffer): string;
    protected writeLogToFile(line: string | Buffer, logFilePath: string): void;
    start(): Promise<StartedImportManagerContainer>;
}
export declare class StartedImportManagerContainer extends AbstractStartedContainer implements HealthCheckableContainer {
    constructor(startedTestContainer: StartedTestContainer);
    /**
     * Import manager container doesn't need health checks - it runs to completion
     */
    getHealthCheckExecutor(): HealthCheckExecutor;
}
