import { PlatformConfig } from '../models/interfaces/platform-config.interface';
/**
 * Utility function to determine if logging should be enabled based on platform configuration
 * @param config Platform configuration object
 * @param networkAliases Optional array of network aliases for the container. If provided, selective logging is applied.
 * @returns boolean indicating whether logging should be enabled
 */
export declare function loggingEnabled(config: PlatformConfig, networkAliases?: string[]): boolean;
