import { RunSummary } from '../types/run-summary.interface';
import { E2eExecutionReport } from '../types/results.interface';
/**
 * Handles artifact directory setup and persistence for one runner execution.
 */
export declare class ArtifactsManager {
    private artifactsRoot;
    private runDir;
    private logsDir;
    private containersLogsDir;
    private runnerLogPath;
    constructor(baseDir: string | undefined, runId: string);
    /**
     * Create all required artifact directories for the current run.
     *
     * @returns No return value.
     */
    ensureDirectories(): void;
    /**
     * @returns Absolute path to the run-specific artifact directory.
     */
    getRunDir(): string;
    /**
     * @returns Absolute path to the artifacts root directory.
     */
    getArtifactsRoot(): string;
    /**
     * @returns Absolute path to the run-specific logs directory.
     */
    getLogsDir(): string;
    /**
     * @returns Absolute path to the runner log file.
     */
    getRunnerLogPath(): string;
    /**
     * Get the log file path for a specific container.
     *
     * @param containerName Name of the container
     * @returns Absolute path to the container's log file
     */
    getContainerLogPath(containerName: string): string;
    /**
     * Append a timestamped line to the runner log file.
     *
     * @param message Message text to append.
     * @returns No return value.
     */
    writeLogLine(message: string): void;
    /**
     * Write the run summary as JSON.
     *
     * @param summary Summary object to persist.
     * @returns No return value.
     */
    writeSummary(summary: RunSummary): void;
    /**
     * Write ordered E2E execution records and aggregate summary.
     */
    writeE2eExecutions(result: E2eExecutionReport): void;
    /**
     * Copy E2E result files into the run artifacts directory when present.
     *
     * @returns No return value.
     */
    copyE2eResults(): void;
}
