import { CliOptions } from './types/cli-options.interface';
import { PlatformRuntime } from '../lib/models/interfaces/platform-runtime.interface';
/**
 * Orchestrates one complete integration test run lifecycle.
 */
export declare class IntegrationTestsRunner {
    private static readonly EXIT_SUCCESS;
    private static readonly EXIT_FAILURE;
    private readonly options;
    private readonly artifacts;
    private readonly logger;
    private readonly platformRuntime;
    private readonly startTime;
    private readonly runId;
    private isShuttingDown;
    private timeoutHandle?;
    private containerLogPath?;
    private containerLogWriter?;
    private containerLogStreams;
    private restoreTerminalStreams?;
    private interruptedSignal?;
    private sigintHandler?;
    private sigtermHandler?;
    constructor(options: CliOptions, platformFactory?: () => PlatformRuntime);
    /**
     * Execute the integration run: bootstrap, validate, run checks/tests, and cleanup.
     *
     * @returns Numeric process-style exit code describing the final run status.
     */
    run(): Promise<number>;
    private initializeRunContext;
    private finishDryRun;
    private executePlatformFlow;
    private runE2eSequence;
    private finalizeByE2eResult;
    private loadConfig;
    private cleanup;
    private finalize;
    private setupSignalHandlers;
    private throwIfInterrupted;
    private removeSignalHandlers;
    private log;
    private resolveContainerLogPath;
    private startContainerLogCapture;
    private stopContainerLogCapture;
    private ensureContainerLogWriter;
    private startTerminalLogCapture;
    private stopTerminalLogCapture;
    private writeContainerLog;
    private generateRunId;
}
