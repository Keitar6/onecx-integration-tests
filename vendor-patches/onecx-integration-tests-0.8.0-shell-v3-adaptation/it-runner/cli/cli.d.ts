import { CliOptions } from '../types/cli-options.interface';
/**
 * Parse CLI arguments into normalized runner options.
 *
 * Uses environment variables as defaults where available:
 * - `IT_VERBOSE`
 * - `IT_CAPTURE_LOGS`
 *
 * @param argv User-provided CLI arguments (without node executable prefix).
 * @param env Process environment used for default values.
 * @returns Normalized CLI options for the integration test runner.
 */
export declare function parseCliArgs(argv: string[], env: NodeJS.ProcessEnv): CliOptions;
/**
 * Print generated CLI help text to stdout.
 *
 * @returns No return value.
 */
export declare function printHelp(): void;
