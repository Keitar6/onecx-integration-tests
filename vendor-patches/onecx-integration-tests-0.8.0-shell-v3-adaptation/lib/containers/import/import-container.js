"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartedImportManagerContainer = exports.ImportManagerContainer = void 0;
const tslib_1 = require("tslib");
const testcontainers_1 = require("testcontainers");
const fs = tslib_1.__importStar(require("fs"));
const path = tslib_1.__importStar(require("path"));
const health_check_executor_1 = require("../../utils/health-check-executor");
class ImportManagerContainer extends testcontainers_1.GenericContainer {
    containerInfoPath;
    platformConfig;
    containerName = 'importManager';
    importScript = 'import-runner.ts'; // Default import script
    loggingEnabled = false;
    logFilePath;
    constructor(image, containerInfoPath, platformConfig) {
        super(image);
        this.containerInfoPath = containerInfoPath;
        this.platformConfig = platformConfig;
        this.withNetworkAliases(this.containerName);
    }
    withContainerName(containerName) {
        this.containerName = containerName;
        return this;
    }
    withImportScript(scriptName) {
        this.importScript = scriptName;
        return this;
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
        const { importsPath } = this.platformConfig.config ?? {};
        const resolvedImportsPath = importsPath ? path.resolve(importsPath) : path.resolve(__dirname, '../../../imports');
        const scriptsPath = path.resolve(__dirname, '../../../imports-scripts');
        this.withCopyFilesToContainer([
            {
                source: this.containerInfoPath,
                target: '/app/container-info.json',
            },
        ])
            .withCopyDirectoriesToContainer([
            {
                source: scriptsPath,
                target: '/app',
            },
            {
                source: resolvedImportsPath,
                target: '/app',
            },
        ])
            .withCommand([
            'sh',
            '-c',
            [
                'cd /app',
                'ls -a',
                'cd ./workspace',
                'ls -a',
                'cd ..',
                `npm install --no-audit --no-fund --prefer-offline ts-node@10.9.2 typescript@5.7.3 @types/node@20 axios`,
                `npx ts-node ${this.importScript}`,
            ].join(' && '),
        ]);
        if (this.logFilePath) {
            this.withLogConsumer((stream) => {
                stream.on('data', (line) => this.writeLogToFile(line, this.logFilePath));
                stream.on('err', (line) => this.writeLogToFile(line, this.logFilePath));
            });
        }
        return new StartedImportManagerContainer(await super.start());
    }
}
exports.ImportManagerContainer = ImportManagerContainer;
class StartedImportManagerContainer extends testcontainers_1.AbstractStartedContainer {
    constructor(startedTestContainer) {
        super(startedTestContainer);
    }
    /**
     * Import manager container doesn't need health checks - it runs to completion
     */
    getHealthCheckExecutor() {
        return new health_check_executor_1.SkipHealthCheckExecutor('Import Manager');
    }
}
exports.StartedImportManagerContainer = StartedImportManagerContainer;
//# sourceMappingURL=import-container.js.map