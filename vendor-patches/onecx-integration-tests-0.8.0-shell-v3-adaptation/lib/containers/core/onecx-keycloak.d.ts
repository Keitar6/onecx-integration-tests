import { AbstractStartedContainer, GenericContainer, StartedTestContainer } from 'testcontainers';
import { StartedOnecxPostgresContainer } from './onecx-postgres';
import { HealthCheck } from 'testcontainers/build/types';
import { HealthCheckableContainer } from '../../models/interfaces/health-checkable-container.interface';
import { HealthCheckExecutor } from '../../models/interfaces/health-check-executor.interface';
import { PlatformConfig } from 'src/lib/models';
interface OnecxEnvironment {
    realm: string;
    adminRealm: string;
    adminUsername: string;
    adminPassword: string;
    keycloakDatabaseUsername: string;
    keycloakDatabasePassword: string;
    keycloakDatabase: string;
    keycloakHostname: string;
    port: number;
}
export declare class OnecxKeycloakContainer extends GenericContainer {
    private readonly databaseContainer;
    private readonly platformConfig;
    private onecxEnvironment;
    private initDefaultRealms;
    private initRealmPath;
    protected loggingEnabled: boolean;
    protected logFilePath?: string;
    constructor(image: string, databaseContainer: StartedOnecxPostgresContainer, platformConfig: PlatformConfig);
    private setDefaultHealthCheck;
    withRealm(realm: string): this;
    withAdminUsername(adminUsername: string): this;
    withAdminPassword(adminPassword: string): this;
    withKeycloakUsername(keycloakDatabaseUsername: string): this;
    withKeycloakPassword(keycloakDatabasePassword: string): this;
    withEnvironmentHostname(hostname: string): this;
    withInitPath(path: string): this;
    withDefaultPath(path: string): this;
    withKeycloakDatabase(keycloakDatabase: string): this;
    withAdminRealm(adminRealm: string): this;
    withPort(port: number): this;
    withLoggingEnabled(log: boolean): this;
    withLogFilePath(filePath: string): this;
    protected getFormattedLogLine(line: string | Buffer): string;
    protected writeLogToFile(line: string | Buffer, logFilePath: string): void;
    getRealm(): string;
    getAdminRealm(): string;
    getAdminUsername(): string;
    getAdminPassword(): string;
    getKeycloakDatabaseUsername(): string;
    getKeycloakDatabasePassword(): string;
    getEnvironmentHostname(): string;
    getPort(): number;
    getKeycloakDatabase(): string;
    start(): Promise<StartedOnecxKeycloakContainer>;
}
export declare class StartedOnecxKeycloakContainer extends AbstractStartedContainer implements HealthCheckableContainer {
    private readonly onecxKeycloakEnvironment;
    private readonly networkAliases;
    private readonly healthCheck;
    constructor(startedTestContainer: StartedTestContainer, onecxKeycloakEnvironment: OnecxEnvironment, networkAliases: string[], healthCheck: HealthCheck);
    /**
     * Creates Quarkus-specific health check strategy
     * Uses URL from health check or falls back to default
     */
    getHealthCheckExecutor(): HealthCheckExecutor;
    getRealm(): string;
    getAdminRealm(): string;
    getAdminUsername(): string;
    getAdminPassword(): string;
    getKeycloakDatabaseUsername(): string;
    getKeycloakDatabasePassword(): string;
    getEnvironmentHostname(): string;
    getKeycloakDatabase(): string;
    getPort(): number;
    getNetworkAliases(): string[];
}
export {};
