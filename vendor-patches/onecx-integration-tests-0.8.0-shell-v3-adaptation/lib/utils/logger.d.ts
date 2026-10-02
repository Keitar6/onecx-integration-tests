/**
 * Centralized logging messages
 */
export declare const LogMessages: {
    readonly CONTAINER_STARTED: "Container started successfully";
    readonly CONTAINER_STOPPED: "Container stopped successfully";
    readonly CONTAINER_FAILED: "Container operation failed";
    readonly PLATFORM_MANAGER_INIT: "Initializing Platform Manager";
    readonly PLATFORM_START: "Starting platform containers";
    readonly PLATFORM_STOP: "Stopping all containers";
    readonly PLATFORM_READY: "Platform is ready";
    readonly PLATFORM_SHUTDOWN: "Platform shutdown completed";
    readonly HEALTH_CHECK_START: "Starting health check";
    readonly HEALTH_CHECK_SUCCESS: "Health check passed";
    readonly HEALTH_CHECK_FAILED: "Health check failed";
    readonly HEALTH_CHECK_SKIP: "Skipping health check - no endpoint available";
    readonly HEALTH_CHECK_KEYCLOAK: "Checking Keycloak health";
    readonly HEALTH_CHECK_CONTAINER: "Checking service health";
    readonly CONTAINER_HEALTHY: "Container is healthy";
    readonly CONTAINER_UNHEALTHY: "Container is unhealthy";
    readonly STARTUP_TIMEOUT: "Container startup timed out";
    readonly STARTUP_SUCCESS: "All containers started successfully";
    readonly STARTUP_FAILED: "Container startup failed";
    readonly DATA_IMPORT_START: "Starting data import";
    readonly DATA_IMPORT_SUCCESS: "Data import completed successfully";
    readonly DATA_IMPORT_FAILED: "Data import failed";
    readonly DATA_IMPORT_PROCESS_COMPLETE: "Import process completed";
    readonly DATA_IMPORT_PROCESS_RUNNING: "Import process still running";
    readonly DATA_IMPORT_PROCESS_ERROR: "Import process completed with error";
    readonly DATA_IMPORT_CLEANUP: "Container info file cleaned up";
    readonly DATA_IMPORT_FILE_CREATED: "Container info file created";
    readonly NETWORK_CREATE: "Creating network";
    readonly NETWORK_CREATED: "Network created successfully";
    readonly NETWORK_DESTROY: "Destroying network";
    readonly NETWORK_DESTROYED: "Network destroyed successfully";
    readonly IMAGE_VERIFY_FAILED: "Image verification failed, falling back to default";
    readonly IMAGE_VERIFY_SUCCESS: "Image verification successful";
    readonly IMAGE_PULL_START: "Starting image pull verification";
    readonly IMAGE_PULL_SUCCESS: "Image pulled successfully";
    readonly IMAGE_PULL_FAILED: "Image pull failed";
    readonly CONFIG_LOAD_START: "Loading configuration file";
    readonly CONFIG_LOAD_SUCCESS: "Configuration loaded successfully";
    readonly CONFIG_LOAD_ERROR: "Failed to load configuration";
    readonly CONFIG_CREATE_SUCCESS: "Default configuration created";
    readonly CONFIG_CREATE_ERROR: "Failed to create configuration";
    readonly CONFIG_FOUND: "Configuration file found";
    readonly CONFIG_NOT_FOUND: "Configuration file not found in standard locations";
    readonly CONFIG_VALIDATION_WARN: "Configuration validation warning";
};
export type LogMessageKey = keyof typeof LogMessages;
export type LoggerLevel = 'info' | 'warn' | 'error' | 'success';
export interface LoggerOptions {
    filePath?: string;
    enableConsole?: boolean;
}
/**
 * Structured logger with timestamp, class and context information
 */
export declare class Logger {
    private static globalWriter?;
    private static globalFilePath?;
    private className;
    private writer?;
    private enableConsole;
    constructor(className: string, options?: string | LoggerOptions);
    /**
     * Configure a shared log file sink used by all Logger instances.
     *
     * The argument must be a full file path (for example `.../logs/runner-output.log`).
     * The parent directory is created automatically.
     *
     * Passing `undefined` disables the shared sink and closes any active global writer.
     */
    static configureGlobalFilePath(filePath: string | undefined): void;
    /**
     * Flush and close the shared global writer when one is active.
     */
    static closeGlobalWriter(): Promise<void>;
    private formatTimestamp;
    private formatMessage;
    private formatTerminalMessage;
    private writeToFile;
    private appendContext;
    private emit;
    log(level: LoggerLevel, message: string, context?: string, error?: unknown): void;
    close(): Promise<void>;
    /**
     * Log info message - accepts LogMessages values only
     */
    info(message: string, context?: string): void;
    /**
     * Log success message - accepts LogMessages values only
     */
    success(message: string, context?: string): void;
    /**
     * Log error message - accepts LogMessages values only
     */
    error(message: string, context?: string, error?: unknown): void;
    /**
     * Log warning message - accepts LogMessages values only
     */
    warn(message: string, context?: string): void;
    /**
     * Log debug message - only shows on terminal if --verbose flag or config enables it
     */
    debug(message: string, context?: string): void;
    /**
     * Log based on HTTP status code
     */
    status(message: string, statusCode: number, context?: string): void;
    /**
     * Log duration of an operation
     */
    logDuration(message: string, durationMs: number, context?: string): void;
}
