import { PlatformConfig } from '../models/interfaces/platform-config.interface';
export interface ValidationResult {
    isValid: boolean;
    config?: PlatformConfig;
    errors?: string[];
}
export declare class PlatformConfigJsonValidator {
    private ajv;
    private readonly CONFIG_FILE_PATTERN;
    private readonly DEFAULT_CONFIG_RELATIVE_PATH;
    private readonly SEARCH_ROOT;
    private readonly SCHEMA;
    constructor();
    /**
     * Validates the platform config JSON file against the schema.
     * @param configFilePath Optional path to config file. If not provided, resolves default and then searches recursively.
     * @returns ValidationResult with config data if valid.
     */
    validateConfigFile(configFilePath?: string): ValidationResult;
    /**
     * Resolves the config file path, checking naming conventions and location
     */
    private resolveConfigPath;
    /**
     * Recursively search for config files in the given directory
     */
    private findConfigFilesRecursively;
    /**
     * Reads the config file content
     */
    private readConfigFile;
    /**
     * Parses the config file JSON content
     */
    private parseConfigFile;
    /**
     * Formats AJV validation errors into readable messages
     */
    private formatValidationErrors;
    /**
     * Check for duplicate E2E network aliases.
     * We deliberately scope this to E2E entries to avoid unintentionally changing
     * validation behavior for service/bff/ui aliases that share the same schema definition.
     */
    private validateNetworkAliases;
    /**
     * Checks if a file path follows the naming convention
     */
    isValidConfigFileName(filePath: string): boolean;
    /**
     * Gets the search root directory path
     */
    getDefaultConfigPath(): string;
}
