import { CONTAINER } from '../models/enums/container.enum';
import type { AllowedContainerTypes } from '../models/types/allowed-container.type';
/**
 * Central registry for managing container lifecycle and access
 * Acts as an intermediary between PlatformManager and container starters
 */
export declare class ContainerRegistry {
    private containers;
    /**
     * Register a container in the registry
     */
    addContainer<T extends AllowedContainerTypes>(key: string | CONTAINER, container: T): void;
    /**
     * Get a container by key
     */
    getContainer<T extends AllowedContainerTypes>(key: string | CONTAINER): T | undefined;
    /**
     * Check if a container exists in the registry
     */
    hasContainer(key: string | CONTAINER): boolean;
    /**
     * Get all containers as a map
     */
    getAllContainers(): Map<string | CONTAINER, AllowedContainerTypes>;
    /**
     * Get all container keys
     */
    getContainerKeys(): (string | CONTAINER)[];
    /**
     * Remove a container from the registry (useful for cleanup)
     */
    removeContainer(key: string | CONTAINER): boolean;
    /**
     * Clear all containers from the registry
     */
    clear(): void;
    /**
     * Get the number of registered containers
     */
    size(): number;
    /**
     * Helper method to get a string representation of the container key
     */
    private getContainerKey;
}
