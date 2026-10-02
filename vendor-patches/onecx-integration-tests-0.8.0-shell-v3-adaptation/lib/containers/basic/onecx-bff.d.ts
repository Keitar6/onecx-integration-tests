import { AbstractStartedContainer, GenericContainer, StartedTestContainer } from 'testcontainers';
import { BffDetails } from '../../models/interfaces/bff.interface';
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak';
import { HealthCheckableContainer } from '../../models/interfaces/health-checkable-container.interface';
import { HealthCheckExecutor } from '../../models/interfaces/health-check-executor.interface';
import { CommandHealthCheckConfig, HealthCheckConfig } from '../../models/interfaces/testcontainers-health-check.adapter';
export declare class BffContainer extends GenericContainer {
    private readonly keycloakContainer;
    private details;
    private port;
    protected loggingEnabled: boolean;
    protected logFilePath?: string;
    private commandHealthCheckConfig?;
    private healthCheckConfigs;
    constructor(image: string, keycloakContainer: StartedOnecxKeycloakContainer);
    withPermissionsProductName(permissionsProductName: string): this;
    withPort(port: number): this;
    withCommandHealthCheck(config: CommandHealthCheckConfig): this;
    withHealthChecks(configs: HealthCheckConfig[]): this;
    getKeycloakContainer(): StartedOnecxKeycloakContainer;
    getPort(): number;
    withLoggingEnabled(log: boolean): this;
    withLogFilePath(filePath: string): this;
    protected getFormattedLogLine(line: string | Buffer): string;
    protected writeLogToFile(line: string | Buffer, logFilePath: string): void;
    start(): Promise<StartedBffContainer>;
}
export declare class StartedBffContainer extends AbstractStartedContainer implements HealthCheckableContainer {
    private readonly details;
    private readonly networkAliases;
    private readonly port;
    private readonly commandHealthCheck;
    private readonly healthCheckConfigs;
    constructor(startedTestContainer: StartedTestContainer, details: BffDetails, networkAliases: string[], port: number, commandHealthCheck: CommandHealthCheckConfig | undefined, healthCheckConfigs: HealthCheckConfig[]);
    getHealthCheckExecutor(): HealthCheckExecutor;
    getPermissionProductName(): string;
    getNetworkAliases(): string[];
    getPort(): number;
}
