import { AbstractStartedContainer, GenericContainer, StartedTestContainer } from 'testcontainers';
import { UiDetails } from '../../models/interfaces/ui.interface';
import { HealthCheckableContainer } from '../../models/interfaces/health-checkable-container.interface';
import { HealthCheckExecutor } from '../../models/interfaces/health-check-executor.interface';
import { CommandHealthCheckConfig, HealthCheckConfig } from '../../models/interfaces/testcontainers-health-check.adapter';
export declare class UiContainer extends GenericContainer {
    private details;
    private port;
    protected loggingEnabled: boolean;
    protected logFilePath?: string;
    private commandHealthCheckConfig?;
    private healthCheckConfigs;
    constructor(image: string);
    withAppBaseHref(appBaseHref: string): this;
    withAppId(appId: string): this;
    withProductName(productName: string): this;
    withPort(port: number): this;
    withCommandHealthCheck(config: CommandHealthCheckConfig): this;
    withHealthChecks(configs: HealthCheckConfig[]): this;
    withLoggingEnabled(log: boolean): this;
    withLogFilePath(filePath: string): this;
    protected getFormattedLogLine(line: string | Buffer): string;
    protected writeLogToFile(line: string | Buffer, logFilePath: string): void;
    start(): Promise<StartedUiContainer>;
}
export declare class StartedUiContainer extends AbstractStartedContainer implements HealthCheckableContainer {
    private readonly details;
    private readonly networkAliases;
    private readonly port;
    private readonly commandHealthCheck;
    private readonly healthCheckConfigs;
    constructor(startedTestContainer: StartedTestContainer, details: UiDetails, networkAliases: string[], port: number, commandHealthCheck: CommandHealthCheckConfig | undefined, healthCheckConfigs: HealthCheckConfig[]);
    getHealthCheckExecutor(): HealthCheckExecutor;
    getAppBaseHref(): string;
    getAppId(): string;
    getProductName(): string;
    getNetworkAliases(): string[];
    getPort(): number;
    getCommandHealthCheck(): CommandHealthCheckConfig | undefined;
    getHealthCheckConfigs(): HealthCheckConfig[];
    getStartedTestContainer(): StartedTestContainer;
    getDetails(): UiDetails;
}
