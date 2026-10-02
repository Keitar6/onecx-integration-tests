import { CONTAINER } from '../models/enums/container.enum';
import { PlatformConfig } from '../models/interfaces/platform-config.interface';
import { E2eExecutionRecord } from '../models/interfaces/e2e.interface';
import type { AllowedContainerTypes } from '../models/types/allowed-container.type';
import { ContainerHealthStatus } from '../models/interfaces/health-checker.interface';
import { PlatformConfigJsonValidator } from './json-validator';
import { PlatformInfoExporter } from './platform-info-exporter';
import { PlatformInfo } from '../models/interfaces/platform-info-exporter.interface';
import type { PlatformRuntime } from '../models/interfaces/platform-runtime.interface';
/**
 * Type for a function that provides log file paths for containers
 */
export type LogFilePathProvider = (containerName: string) => string | undefined;
export declare class PlatformManager implements PlatformRuntime {
    /**
     * Container registry for managing all containers
     */
    private containerRegistry;
    /**
     * Optional provider for container log file paths
     */
    private logFilePathProvider?;
    /**
     * Needed classes for startContainers
     */
    private network?;
    private imageResolver?;
    private CoreContainerStarter?;
    private UserDefinedContainerStarter?;
    private dataImporter?;
    private healthChecker?;
    private jsonValidator;
    private validatedConfig?;
    private platformInfoExporter?;
    constructor(configFilePath?: string, logFilePathProvider?: LogFilePathProvider);
    /**
     * Set the log file path provider
     */
    setLogFilePathProvider(provider: LogFilePathProvider): void;
    /**
     * Orchestrates the startup of the default services and the creation of user-defined containers.
     * @param config Optional config override. If not provided, uses validated config from constructor
     */
    startContainers(config?: PlatformConfig): Promise<void>;
    /**
     * Get the validated configuration
     */
    getValidatedConfig(): PlatformConfig | undefined;
    /**
     * Check if a valid configuration file was found and loaded
     */
    hasValidatedConfig(): boolean;
    /**
     * Get the JSON validator instance
     */
    getJsonValidator(): PlatformConfigJsonValidator;
    /**
     * Check the health of all running containers
     */
    checkAllHealthy(): Promise<ContainerHealthStatus[]>;
    /**
     * Check the health of one runnting contianer
     * @param containerName
     * @returns
     */
    checkHealthy(containerName: string): Promise<ContainerHealthStatus>;
    /**
     * Check if heartbeat monitoring is currently running
     */
    isHeartbeatRunning(): boolean;
    /**
     * Get the current heartbeat configuration
     */
    getHeartbeatConfig(): import("../models/interfaces/health-checker.interface").HeartbeatConfig | undefined;
    /**
     * Start heartbeat monitoring manually
     */
    startHeartbeat(): void;
    /**
     * Stop heartbeat monitoring manually
     */
    stopHeartbeat(): void;
    /**
     * Get all containers (standard and custom)
     */
    getAllContainers(): Map<string, AllowedContainerTypes>;
    /**
     * Get a container by key (works for both standard and custom)
     */
    getContainer<T extends AllowedContainerTypes>(key: string | CONTAINER): T | undefined;
    /**
     * Check if a container exists
     */
    hasContainer(key: string | CONTAINER): boolean;
    /**
     * Remove a container
     */
    removeContainer(key: string | CONTAINER): boolean;
    /**
     * Stop all running services and cleanup resources
     */
    stopAllContainers(): Promise<void>;
    /**
     * Get platform info exporter for URL access
     */
    getInfoExporter(): PlatformInfoExporter | undefined;
    /**
     * Get platform info (convenience method)
     */
    getPlatformInfo(): Promise<PlatformInfo | undefined>;
    /**
     * Export runtime platform metadata to artifacts.
     */
    exportPlatformInfo(): Promise<void>;
    /**
     * Check if E2E tests are configured
     */
    hasE2eConfig(): boolean;
    /**
     * Run E2E tests if configured
     * This should be called after all containers are healthy.
     * E2E container failures are logged and execution continues.
     * @returns Ordered E2E execution records, or undefined if no E2E configured
     */
    startE2eContainers(shouldStop?: () => boolean): Promise<E2eExecutionRecord[] | undefined>;
    /**
     * Create user-defined containers using the UserDefinedContainerStarter
     */
    private createContainers;
    /**
     * Initialize and validate the platform configuration
     */
    private initializeConfiguration;
    /**
     * Stop a container
     * @param key
     */
    private stopContainer;
}
