import { StartedNetwork } from 'testcontainers';
import { ImageResolver } from './image-resolver';
import type { AllowedContainerTypes } from '../models/types/allowed-container.type';
import { PlatformConfig } from '../models/interfaces/platform-config.interface';
type LogFilePathProvider = (containerName: string) => string | undefined;
/**
 * Container information interface containing authentication and service details
 */
export interface ContainerInfo {
    tokenValues: {
        username: string;
        password: string;
        realm: string;
        alias: string;
        port: number;
        clientId: string;
    };
    services: Record<string, {
        alias: string;
        port: number;
    }>;
}
export declare class DataImporter {
    private imageResolver;
    private readonly logFilePathProvider?;
    constructor(imageResolver: ImageResolver, logFilePathProvider?: LogFilePathProvider | undefined);
    /**
     * Import default data using the ImportManagerContainer
     */
    importDefaultData(network: StartedNetwork, startedContainers: Map<string, AllowedContainerTypes>, config: PlatformConfig): Promise<void>;
    /**
     * Create container info JSON file with container details
     * @param startedContainers Map of started containers
     * @returns Path to the created container info file
     */
    createContainerInfo(startedContainers: Map<string, AllowedContainerTypes>): string;
    private extractKeycloakContainer;
    private buildKeycloakInfo;
    private extractShellUiContainer;
    private buildShellUiInfo;
    /**
     * Build services info from all started containers
     * Creates mapping for all containers that can be services
     * @param startedContainers Map of all started containers
     * @returns Record of service names to their connection info
     */
    private buildServicesInfo;
    /**
     * Map container names to service names expected by ImportManager
     * @param containerName The internal container name
     * @returns The service name or null if not a mappable service
     */
    private getServiceNameFromContainer;
    private writeContainerInfoFile;
    /**
     * Clean up temporary container info file
     */
    private cleanupContainerInfo;
    /**
     * Check if the import process is still running
     */
    private checkImportStatus;
    private startImportLogForwarding;
}
export {};
