import { StartedNetwork } from 'testcontainers';
import { ContainerRegistry } from './container-registry';
import { CONTAINER } from '../models/enums/container.enum';
import { PlatformInfo, ContainerInfo } from '../models/interfaces/platform-info-exporter.interface';
export declare class PlatformInfoExporter {
    private readonly containerRegistry;
    private readonly network;
    private readonly outputDir;
    constructor(containerRegistry: ContainerRegistry, network: StartedNetwork);
    /**
     * Get complete platform info with all URLs
     */
    getPlatformInfo(): Promise<PlatformInfo>;
    /**
     * Get info for a specific container
     */
    getContainerInfo(containerName: CONTAINER): Promise<ContainerInfo | undefined>;
    /**
     * Get all container infos - dynamically from registry
     */
    getAllContainerInfos(): Promise<Record<string, ContainerInfo>>;
    /**
     * Log platform info to console
     */
    logPlatformInfo(): Promise<void>;
    /**
     * Write platform info to JSON file
     * Always writes to the fixed E2E output directory
     */
    writePlatformInfoFile(filePath?: string): Promise<void>;
    /**
     * Export all (log + file)
     */
    exportAll(filePath?: string): Promise<void>;
    private buildContainerInfo;
}
