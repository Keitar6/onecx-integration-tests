"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.E2eExecutionHandler = exports.E2eExecutionError = void 0;
class E2eExecutionError extends Error {
    status;
    constructor(status, cause) {
        super(cause instanceof Error ? cause.message : String(cause));
        this.status = status;
        this.name = 'E2eExecutionError';
    }
}
exports.E2eExecutionError = E2eExecutionError;
/**
 * Handles E2E container execution with error handling and recovery.
 * Wraps container execution with try-catch and creates appropriate execution records.
 */
class E2eExecutionHandler {
    /**
     * Execute E2E container with error handling.
     * @param executor Async function that executes the E2E container and returns success record
     * @param onError Creates the failure record with the execution context captured by the caller
     * @returns E2E execution record (success or failure)
     */
    async executeWithErrorHandling(executor, onError) {
        try {
            return await executor();
        }
        catch (error) {
            return onError(error);
        }
    }
    /**
     * Create execution record from container exit code.
     */
    createExecutionRecord(e2eConfig, sequence, total, startedAt, finishedAt, duration, exitCode) {
        if (exitCode === 0) {
            return {
                networkAlias: e2eConfig.networkAlias,
                sequence,
                total,
                status: 'passed',
                success: true,
                exitCode,
                startedAt,
                finishedAt,
                duration,
            };
        }
        if (typeof exitCode === 'number') {
            return {
                networkAlias: e2eConfig.networkAlias,
                sequence,
                total,
                status: 'failed_exit_code',
                success: false,
                exitCode,
                startedAt,
                finishedAt,
                duration,
            };
        }
        return {
            networkAlias: e2eConfig.networkAlias,
            sequence,
            total,
            status: 'failed_wait',
            success: false,
            errorMessage: 'E2E container finished without an inspectable exit code',
            startedAt,
            finishedAt,
            duration,
        };
    }
    /**
     * Create failed execution record from error
     */
    createFailedRecord(context, startedAt, duration, error) {
        const status = this.classifyExecutionError(error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        const finishedAt = new Date().toISOString();
        return {
            networkAlias: context.e2eConfig.networkAlias,
            sequence: context.sequence,
            total: context.total,
            status,
            success: false,
            errorMessage,
            startedAt,
            finishedAt,
            duration,
        };
    }
    /**
     * Classify error to determine execution status
     */
    classifyExecutionError(error) {
        if (error instanceof E2eExecutionError) {
            return error.status;
        }
        return 'failed_unexpected';
    }
}
exports.E2eExecutionHandler = E2eExecutionHandler;
//# sourceMappingURL=e2e-execution.handler.js.map