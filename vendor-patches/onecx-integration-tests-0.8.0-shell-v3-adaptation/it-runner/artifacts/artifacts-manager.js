"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtifactsManager = void 0;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const path = tslib_1.__importStar(require("path"));
const e2e_constants_1 = require("../../lib/config/e2e-constants");
const artifacts_1 = require("../../lib/config/artifacts");
/**
 * Handles artifact directory setup and persistence for one runner execution.
 */
class ArtifactsManager {
    artifactsRoot;
    runDir;
    logsDir;
    containersLogsDir;
    runnerLogPath;
    constructor(baseDir, runId) {
        this.artifactsRoot = (0, artifacts_1.resolveArtifactsRoot)(baseDir);
        this.runDir = (0, artifacts_1.resolveRunArtifactsDir)(this.artifactsRoot, runId);
        this.logsDir = path.join(this.runDir, 'logs');
        this.containersLogsDir = path.join(this.logsDir, 'containers');
        this.runnerLogPath = path.join(this.logsDir, 'runner-output.log');
    }
    /**
     * Create all required artifact directories for the current run.
     *
     * @returns No return value.
     */
    ensureDirectories() {
        fs.mkdirSync(this.runDir, { recursive: true });
        fs.mkdirSync(this.logsDir, { recursive: true });
        fs.mkdirSync(this.containersLogsDir, { recursive: true });
        fs.mkdirSync(path.join(this.runDir, 'reports'), { recursive: true });
        fs.mkdirSync(path.join(this.runDir, e2e_constants_1.E2E_OUTPUT_DIR), { recursive: true });
        // Ensure runner output log file exists even before the first write.
        fs.closeSync(fs.openSync(this.runnerLogPath, 'a'));
    }
    /**
     * @returns Absolute path to the run-specific artifact directory.
     */
    getRunDir() {
        return this.runDir;
    }
    /**
     * @returns Absolute path to the artifacts root directory.
     */
    getArtifactsRoot() {
        return this.artifactsRoot;
    }
    /**
     * @returns Absolute path to the run-specific logs directory.
     */
    getLogsDir() {
        return this.logsDir;
    }
    /**
     * @returns Absolute path to the runner log file.
     */
    getRunnerLogPath() {
        return this.runnerLogPath;
    }
    /**
     * Get the log file path for a specific container.
     *
     * @param containerName Name of the container
     * @returns Absolute path to the container's log file
     */
    getContainerLogPath(containerName) {
        // Sanitize container name for use as filename
        const sanitized = containerName.replace(/[^a-zA-Z0-9._-]/g, '_');
        return path.join(this.containersLogsDir, `${sanitized}.log`);
    }
    /**
     * Append a timestamped line to the runner log file.
     *
     * @param message Message text to append.
     * @returns No return value.
     */
    writeLogLine(message) {
        const timestamp = new Date().toISOString();
        const line = `[${timestamp}] ${message}\n`;
        fs.appendFileSync(this.runnerLogPath, line);
    }
    /**
     * Write the run summary as JSON.
     *
     * @param summary Summary object to persist.
     * @returns No return value.
     */
    writeSummary(summary) {
        const summaryPath = path.join(this.runDir, 'summary.json');
        fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    }
    /**
     * Write ordered E2E execution records and aggregate summary.
     */
    writeE2eExecutions(result) {
        const outputPath = path.join(this.runDir, 'e2e', 'e2e-executions.json');
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
    }
    /**
     * Copy E2E result files into the run artifacts directory when present.
     *
     * @returns No return value.
     */
    copyE2eResults() {
        const e2eResultsDir = (0, e2e_constants_1.getE2eOutputPath)();
        const targetDir = path.join(this.runDir, e2e_constants_1.E2E_OUTPUT_DIR);
        if (path.resolve(e2eResultsDir) === path.resolve(targetDir)) {
            return;
        }
        if (fs.existsSync(e2eResultsDir)) {
            fs.cpSync(e2eResultsDir, targetDir, { recursive: true });
        }
    }
}
exports.ArtifactsManager = ArtifactsManager;
//# sourceMappingURL=artifacts-manager.js.map