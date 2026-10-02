import { AbstractStartedContainer, GenericContainer, StartedTestContainer } from 'testcontainers';
import { SvcDetails, SvcContainerServices } from '../../models/interfaces/svc.interface';
import { HealthCheckableContainer } from '../../models/interfaces/health-checkable-container.interface';
import { HealthCheckExecutor } from '../../models/interfaces/health-check-executor.interface';
import { CommandHealthCheckConfig, HealthCheckConfig } from '../../models/interfaces/testcontainers-health-check.adapter';
export declare class SvcContainer extends GenericContainer {
    private services;
    protected details: SvcDetails;
    protected shouldCreateDatabase: boolean;
    protected loggingEnabled: boolean;
    protected logFilePath?: string;
    private port;
    private commandHealthCheckConfig?;
    private healthCheckConfigs;
    constructor(image: string, services: SvcContainerServices);
    withDatabaseUsername(databaseUsername: string): this;
    withDatabasePassword(databasePassword: string): this;
    withCommandHealthCheck(config: CommandHealthCheckConfig): this;
    withHealthChecks(configs: HealthCheckConfig[]): this;
    getKeycloakContainer(): import("../core/onecx-keycloak").StartedOnecxKeycloakContainer;
    getPostgresContainer(): import("../core/onecx-postgres").StartedOnecxPostgresContainer | undefined;
    protected validateDatabaseCredentials(): void;
    createDatabaseAtStart(shouldStart: boolean): void;
    withLoggingEnabled(log: boolean): this;
    withLogFilePath(filePath: string): this;
    protected getFormattedLogLine(line: string | Buffer): string;
    protected writeLogToFile(line: string | Buffer, logFilePath: string): void;
    start(): Promise<StartedSvcContainer>;
}
export declare class StartedSvcContainer extends AbstractStartedContainer implements HealthCheckableContainer {
    private readonly details;
    private readonly networkAliases;
    private readonly port;
    private readonly commandHealthCheck;
    private readonly healthCheckConfigs;
    constructor(startedTestContainer: StartedTestContainer, details: SvcDetails, networkAliases: string[], port: number, commandHealthCheck: CommandHealthCheckConfig | undefined, healthCheckConfigs: HealthCheckConfig[]);
    getHealthCheckExecutor(): HealthCheckExecutor;
    getDatabaseUsername(): string;
    getDatabasePassword(): string;
    getPort(): number;
    getNetworkAliases(): string[];
}
