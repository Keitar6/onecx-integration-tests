import { E2eExecutionRecord, E2eExecutionStatus, E2eExecutionContext, E2eContainerInterface } from '../models/interfaces/e2e.interface';
export declare class E2eExecutionError extends Error {
    readonly status: Exclude<E2eExecutionStatus, 'passed' | 'failed_exit_code'>;
    constructor(status: Exclude<E2eExecutionStatus, 'passed' | 'failed_exit_code'>, cause: unknown);
}
/**
 * Handles E2E container execution with error handling and recovery.
 * Wraps container execution with try-catch and creates appropriate execution records.
 */
export declare class E2eExecutionHandler {
    /**
     * Execute E2E container with error handling.
     * @param executor Async function that executes the E2E container and returns success record
     * @param onError Creates the failure record with the execution context captured by the caller
     * @returns E2E execution record (success or failure)
     */
    executeWithErrorHandling(executor: () => Promise<E2eExecutionRecord>, onError: (error: unknown) => E2eExecutionRecord): Promise<E2eExecutionRecord>;
    /**
     * Create execution record from container exit code.
     */
    createExecutionRecord(e2eConfig: E2eContainerInterface, sequence: number, total: number, startedAt: string, finishedAt: string, duration: number, exitCode: number | undefined): E2eExecutionRecord;
    /**
     * Create failed execution record from error
     */
    createFailedRecord(context: E2eExecutionContext, startedAt: string, duration: number, error: unknown): E2eExecutionRecord;
    /**
     * Classify error to determine execution status
     */
    private classifyExecutionError;
}
