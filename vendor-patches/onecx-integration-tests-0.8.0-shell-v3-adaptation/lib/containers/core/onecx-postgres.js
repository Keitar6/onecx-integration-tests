"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartedOnecxPostgresContainer = exports.OnecxPostgresContainer = void 0;
const tslib_1 = require("tslib");
const testcontainers_1 = require("testcontainers");
const fs = tslib_1.__importStar(require("fs"));
const health_check_executor_1 = require("../../utils/health-check-executor");
class OnecxPostgresContainer extends testcontainers_1.GenericContainer {
    onecxPostgresDetails = {
        postgresDatabase: 'postgres',
        postgresUsername: 'postgres',
        postgresPassword: 'admin',
        port: 5432,
    };
    defaultHealthCheck = {
        test: ['CMD-SHELL', `pg_isready -U ${this.onecxPostgresDetails.postgresUsername}`],
        interval: 10_000,
        timeout: 5_000,
        retries: 3,
    };
    loggingEnabled = false;
    logFilePath;
    constructor(image) {
        super(image);
        this.withCommand(['-cmax_prepared_transactions=100']);
        this.withHealthCheck(this.defaultHealthCheck);
        this.withExposedPorts(this.onecxPostgresDetails.port);
        this.withNetworkAliases('postgresdb');
    }
    withPostgresDatabase(postgresDatabase) {
        this.onecxPostgresDetails.postgresDatabase = postgresDatabase;
        return this;
    }
    withPostgresUsername(postgresUsername) {
        this.onecxPostgresDetails.postgresUsername = postgresUsername;
        return this;
    }
    withPostgresPassword(postgresPassword) {
        this.onecxPostgresDetails.postgresPassword = postgresPassword;
        return this;
    }
    getPostgresDatabase() {
        return this.onecxPostgresDetails.postgresDatabase;
    }
    getPostgresUsername() {
        return this.onecxPostgresDetails.postgresUsername;
    }
    getPostgresPassword() {
        return this.onecxPostgresDetails.postgresPassword;
    }
    withLoggingEnabled(log) {
        this.loggingEnabled = log;
        return this;
    }
    withLogFilePath(filePath) {
        this.logFilePath = filePath;
        return this;
    }
    getFormattedLogLine(line) {
        const timestamp = new Date().toISOString();
        const text = typeof line === 'string' ? line : line.toString();
        return `[${timestamp}] ${text}`;
    }
    writeLogToFile(line, logFilePath) {
        const formatted = this.getFormattedLogLine(line);
        fs.appendFileSync(logFilePath, `${formatted}\n`);
    }
    async start() {
        // Re-apply the default health check explicitly if it has not been overridden.
        // This ensures the healthcheck is correctly registered before container startup
        if (JSON.stringify(this.healthCheck) === JSON.stringify(this.defaultHealthCheck)) {
            this.withHealthCheck(this.defaultHealthCheck);
        }
        // Spread existing environment variables to preserve previously set values.
        // This ensures that calling withEnvironment() does not override earlier configurations.
        this.withEnvironment({
            ...this.environment,
            POSTGRES_DB: this.onecxPostgresDetails.postgresDatabase,
            POSTGRES_USER: this.onecxPostgresDetails.postgresUsername,
            POSTGRES_PASSWORD: this.onecxPostgresDetails.postgresPassword,
        });
        if (this.logFilePath) {
            this.withLogConsumer((stream) => {
                stream.on('data', (line) => this.writeLogToFile(line, this.logFilePath));
                stream.on('err', (line) => this.writeLogToFile(line, this.logFilePath));
            });
        }
        this.withWaitStrategy(testcontainers_1.Wait.forAll([testcontainers_1.Wait.forHealthCheck(), testcontainers_1.Wait.forListeningPorts()]));
        return new StartedOnecxPostgresContainer(await super.start(), this.onecxPostgresDetails, this.networkAliases);
    }
}
exports.OnecxPostgresContainer = OnecxPostgresContainer;
class StartedOnecxPostgresContainer extends testcontainers_1.AbstractStartedContainer {
    onecxPostgresDetails;
    networkAliases;
    constructor(startedTestContainer, onecxPostgresDetails, networkAliases) {
        super(startedTestContainer);
        this.onecxPostgresDetails = onecxPostgresDetails;
        this.networkAliases = networkAliases;
    }
    getHealthCheckExecutor() {
        return new health_check_executor_1.SkipHealthCheckExecutor('Postgres Container');
    }
    getPostgresDatabase() {
        return this.onecxPostgresDetails.postgresDatabase;
    }
    getPostgresUsername() {
        return this.onecxPostgresDetails.postgresUsername;
    }
    getPostgresPassword() {
        return this.onecxPostgresDetails.postgresPassword;
    }
    getPort() {
        return this.onecxPostgresDetails.port;
    }
    getNetworkAliases() {
        return this.networkAliases;
    }
    async execCommandsSQL(commands) {
        for (const command of commands) {
            try {
                const result = await this.exec([
                    'psql',
                    '-v',
                    'ON_ERROR_STOP=1',
                    '-U',
                    this.getPostgresUsername(),
                    '-d',
                    'postgres',
                    '-c',
                    command,
                ]);
                if (result.exitCode !== 0) {
                    throw new Error(`Command failed with exit code ${result.exitCode}: ${result.output}`);
                }
            }
            catch (error) {
                console.error(`Failed to execute command: ${command}`, error);
                throw error;
            }
        }
    }
    async getDatabases() {
        const { output, stderr, exitCode } = await this.exec([
            'psql',
            '-U',
            'postgres',
            '-tc',
            `SELECT datname FROM pg_database WHERE datistemplate = false`,
        ]);
        if (exitCode === 0) {
            const databases = output
                .split('\n')
                .map((line) => line.trim())
                .filter((line) => line.length > 0);
            return databases;
        }
        else {
            console.error(`Error listing databases: ${stderr}`);
            return [];
        }
    }
    async doesDatabaseExist(database) {
        const command = [`SELECT 1 FROM pg_database WHERE datname='${database}'`];
        await this.execCommandsSQL(command);
    }
    async createDatabaseUser(user, password) {
        const command = [`CREATE USER ${user} WITH ENCRYPTED PASSWORD '${password}';`];
        await this.execCommandsSQL(command);
    }
    async createDatabase(user) {
        const commands = [
            `CREATE DATABASE ${user} WITH OWNER ${user};`,
            `GRANT ALL PRIVILEGES ON DATABASE ${user} TO ${user};`,
        ];
        await this.execCommandsSQL(commands);
    }
    async createUserAndDatabase(user, password) {
        await this.createDatabaseUser(user, password);
        await this.createDatabase(user);
    }
}
exports.StartedOnecxPostgresContainer = StartedOnecxPostgresContainer;
//# sourceMappingURL=onecx-postgres.js.map