/**
 * Constants for E2E test execution
 */
/**
 * Output directory name for E2E results
 */
export declare const E2E_OUTPUT_DIR = "e2e-results";
/**
 * Container path where E2E results are written inside the container
 */
export declare const E2E_CONTAINER_OUTPUT_PATH = "/e2e-results";
/**
 * Default timeout for E2E container startup/termination wait in milliseconds.
 * 10 minutes is intended for slower CI/CD pipelines.
 * 1000 milli * 60 sec * 10 min
 */
export declare const E2E_DEFAULT_TIMEOUT_MS: number;
/**
 * Get the absolute path for E2E output directory
 */
export declare function getE2eOutputPath(): string;
