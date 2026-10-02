import { AbstractStartedContainer, GenericContainer, StartedTestContainer } from 'testcontainers';
import { HealthCheckableContainer } from '../../models/interfaces/health-checkable-container.interface';
import { SkipHealthCheckExecutor } from '../../utils/health-check-executor';
interface OnecxPostgresDetails {
    postgresDatabase: string;
    postgresUsername: string;
    postgresPassword: string;
    port: number;
}
export declare class OnecxPostgresContainer extends GenericContainer {
    private onecxPostgresDetails;
    private defaultHealthCheck;
    protected loggingEnabled: boolean;
    protected logFilePath?: string;
    constructor(image: string);
    withPostgresDatabase(postgresDatabase: string): this;
    withPostgresUsername(postgresUsername: string): this;
    withPostgresPassword(postgresPassword: string): this;
    getPostgresDatabase(): string;
    getPostgresUsername(): string;
    getPostgresPassword(): string;
    withLoggingEnabled(log: boolean): this;
    withLogFilePath(filePath: string): this;
    protected getFormattedLogLine(line: string | Buffer): string;
    protected writeLogToFile(line: string | Buffer, logFilePath: string): void;
    start(): Promise<StartedOnecxPostgresContainer>;
}
export declare class StartedOnecxPostgresContainer extends AbstractStartedContainer implements HealthCheckableContainer {
    private readonly onecxPostgresDetails;
    private readonly networkAliases;
    constructor(startedTestContainer: StartedTestContainer, onecxPostgresDetails: OnecxPostgresDetails, networkAliases: string[]);
    getHealthCheckExecutor(): SkipHealthCheckExecutor;
    getPostgresDatabase(): string;
    getPostgresUsername(): string;
    getPostgresPassword(): string;
    getPort(): number;
    getNetworkAliases(): string[];
    private execCommandsSQL;
    getDatabases(): Promise<string[]>;
    doesDatabaseExist(database: string): Promise<void>;
    createDatabaseUser(user: string, password: string): Promise<void>;
    createDatabase(user: string): Promise<void>;
    createUserAndDatabase(user: string, password: string): Promise<void>;
}
export {};
