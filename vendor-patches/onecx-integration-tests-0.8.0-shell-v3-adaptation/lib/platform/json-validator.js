"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformConfigJsonValidator = void 0;
const tslib_1 = require("tslib");
const ajv_1 = tslib_1.__importDefault(require("ajv"));
const fs = tslib_1.__importStar(require("fs"));
const path = tslib_1.__importStar(require("path"));
const logger_1 = require("../utils/logger");
const network_alias_utils_1 = require("../utils/network-alias.utils");
const logger = new logger_1.Logger('PlatformConfigJsonValidator');
class PlatformConfigJsonValidator {
    ajv;
    CONFIG_FILE_PATTERN = /platform\.json$/;
    DEFAULT_CONFIG_RELATIVE_PATH = path.join('integration-tests', 'platform', 'platform.json');
    SEARCH_ROOT = process.cwd(); // Search recursively from current working directory
    SCHEMA = 'integration-tests.schema.json';
    constructor() {
        this.ajv = new ajv_1.default({ allErrors: true });
    }
    /**
     * Validates the platform config JSON file against the schema.
     * @param configFilePath Optional path to config file. If not provided, resolves default and then searches recursively.
     * @returns ValidationResult with config data if valid.
     */
    validateConfigFile(configFilePath) {
        try {
            const configPath = this.resolveConfigPath(configFilePath);
            if (!configPath) {
                return {
                    isValid: false,
                    errors: [
                        `No valid config file found. Expected '${this.DEFAULT_CONFIG_RELATIVE_PATH}' or a file matching '*platform.json' under search root: ${this.SEARCH_ROOT}.`,
                    ],
                };
            }
            logger.info(`${logger_1.LogMessages.CONFIG_LOAD_START}: ${configPath}`);
            // Read and parse config file
            const configContent = this.readConfigFile(configPath);
            const config = this.parseConfigFile(configContent, configPath);
            // Load schema
            const schemaPath = path.join(__dirname, `../models/schemas/${this.SCHEMA}`);
            const schemaContent = fs.readFileSync(schemaPath, 'utf8');
            const schema = JSON.parse(schemaContent);
            // Validate against schema
            const validate = this.ajv.compile(schema);
            const isValid = validate(config);
            if (!isValid) {
                const errors = this.formatValidationErrors(validate.errors || []);
                logger.error(`${logger_1.LogMessages.CONFIG_LOAD_ERROR}: ${configPath}`, undefined, errors);
                return {
                    isValid: false,
                    errors,
                };
            }
            const platformConfig = config.platformConfig;
            const semanticErrors = this.validateNetworkAliases(platformConfig);
            if (semanticErrors.length > 0) {
                logger.error(`${logger_1.LogMessages.CONFIG_LOAD_ERROR}: ${configPath}`, undefined, semanticErrors);
                return {
                    isValid: false,
                    errors: semanticErrors,
                };
            }
            logger.success(`${logger_1.LogMessages.CONFIG_LOAD_SUCCESS}: ${configPath}`);
            return {
                isValid: true,
                config: platformConfig,
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown validation error';
            logger.error(`${logger_1.LogMessages.CONFIG_LOAD_ERROR}`, undefined, error);
            return {
                isValid: false,
                errors: [errorMessage],
            };
        }
    }
    /**
     * Resolves the config file path, checking naming conventions and location
     */
    resolveConfigPath(configFilePath) {
        if (configFilePath) {
            if (fs.existsSync(configFilePath)) {
                return configFilePath;
            }
            const resolvedPath = path.isAbsolute(configFilePath)
                ? configFilePath
                : path.resolve(this.SEARCH_ROOT, configFilePath);
            if (fs.existsSync(resolvedPath)) {
                return resolvedPath;
            }
        }
        const defaultConfigPath = path.join(this.SEARCH_ROOT, this.DEFAULT_CONFIG_RELATIVE_PATH);
        if (fs.existsSync(defaultConfigPath)) {
            return defaultConfigPath;
        }
        // Search recursively from current working directory
        const foundFiles = this.findConfigFilesRecursively(this.SEARCH_ROOT, this.CONFIG_FILE_PATTERN);
        if (foundFiles.length > 0) {
            // Return the first found file
            return foundFiles[0];
        }
        return null;
    }
    /**
     * Recursively search for config files in the given directory
     */
    findConfigFilesRecursively(dir, filePattern) {
        const configFiles = [];
        if (!fs.existsSync(dir)) {
            return configFiles;
        }
        try {
            const items = fs.readdirSync(dir, { withFileTypes: true });
            for (const item of items) {
                const fullPath = path.join(dir, item.name);
                if (item.isDirectory()) {
                    // Skip node_modules and other common directories that shouldn't contain config
                    if (!['node_modules', '.git', 'dist', 'build', '.nx', '.github', '.angular', '.stroybook', 'tmp'].includes(item.name)) {
                        configFiles.push(...this.findConfigFilesRecursively(fullPath, filePattern));
                    }
                }
                else if (item.isFile() && filePattern.test(item.name)) {
                    logger.info(`${logger_1.LogMessages.CONFIG_FOUND}: ${fullPath}`);
                    configFiles.push(fullPath);
                }
            }
        }
        catch (error) {
            logger.info(`${logger_1.LogMessages.CONFIG_LOAD_START}: Error reading directory ${dir}: ${error}`);
            // Skip directories that can't be read
        }
        return configFiles;
    }
    /**
     * Reads the config file content
     */
    readConfigFile(configPath) {
        try {
            return fs.readFileSync(configPath, 'utf8');
        }
        catch (error) {
            throw new Error(`Failed to read config file at ${configPath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Parses the config file JSON content
     */
    parseConfigFile(content, configPath) {
        try {
            return JSON.parse(content);
        }
        catch (error) {
            throw new Error(`Invalid JSON in config file ${configPath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Formats AJV validation errors into readable messages
     */
    formatValidationErrors(errors) {
        return errors.map((error) => {
            const err = error;
            const instancePath = err.instancePath || 'root';
            const message = err.message || 'Unknown validation error';
            const allowedValues = err.params?.allowedValues ? ` (allowed: ${err.params.allowedValues.join(', ')})` : '';
            return `${instancePath}: ${message}${allowedValues}`;
        });
    }
    /**
     * Check for duplicate E2E network aliases.
     * We deliberately scope this to E2E entries to avoid unintentionally changing
     * validation behavior for service/bff/ui aliases that share the same schema definition.
     */
    validateNetworkAliases(config) {
        const errors = [];
        const entries = [
            ...(config.container?.service ?? []).map((entry) => ({ type: 'service', alias: entry.networkAlias })),
            ...(config.container?.bff ?? []).map((entry) => ({ type: 'bff', alias: entry.networkAlias })),
            ...(config.container?.ui ?? []).map((entry) => ({ type: 'ui', alias: entry.networkAlias })),
            ...(config.container?.e2e ?? []).map((entry) => ({ type: 'e2e', alias: entry.networkAlias })),
        ];
        for (const entry of entries) {
            try {
                (0, network_alias_utils_1.validateNetworkAlias)(entry.alias, `${entry.type} container`);
            }
            catch (error) {
                errors.push(`/platformConfig/container/${entry.type}: ${error.message}`);
            }
        }
        const e2eEntries = config.container?.e2e ?? [];
        const aliasToIndices = new Map();
        e2eEntries.forEach((entry, index) => {
            const alias = entry.networkAlias;
            const indices = aliasToIndices.get(alias) ?? [];
            indices.push(index);
            aliasToIndices.set(alias, indices);
        });
        for (const [alias, indices] of aliasToIndices.entries()) {
            if (indices.length > 1) {
                errors.push(`/platformConfig/container/e2e: duplicate networkAlias '${alias}' at indices [${indices.join(', ')}]`);
            }
        }
        return errors;
    }
    /**
     * Checks if a file path follows the naming convention
     */
    isValidConfigFileName(filePath) {
        const fileName = path.basename(filePath);
        return this.CONFIG_FILE_PATTERN.test(fileName);
    }
    /**
     * Gets the search root directory path
     */
    getDefaultConfigPath() {
        return path.join(this.SEARCH_ROOT);
    }
}
exports.PlatformConfigJsonValidator = PlatformConfigJsonValidator;
//# sourceMappingURL=json-validator.js.map