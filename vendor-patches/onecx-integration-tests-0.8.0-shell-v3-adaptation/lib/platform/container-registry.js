"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerRegistry = void 0;
const logger_1 = require("../utils/logger");
const logger = new logger_1.Logger('ContainerRegistry');
/**
 * Central registry for managing container lifecycle and access
 * Acts as an intermediary between PlatformManager and container starters
 */
class ContainerRegistry {
    containers = new Map();
    /**
     * Register a container in the registry
     */
    addContainer(key, container) {
        this.containers.set(key, container);
        logger.success(logger_1.LogMessages.CONTAINER_STARTED, this.getContainerKey(key));
    }
    /**
     * Get a container by key
     */
    getContainer(key) {
        return this.containers.get(key);
    }
    /**
     * Check if a container exists in the registry
     */
    hasContainer(key) {
        return this.containers.has(key);
    }
    /**
     * Get all containers as a map
     */
    getAllContainers() {
        return new Map(this.containers);
    }
    /**
     * Get all container keys
     */
    getContainerKeys() {
        return Array.from(this.containers.keys());
    }
    /**
     * Remove a container from the registry (useful for cleanup)
     */
    removeContainer(key) {
        const removed = this.containers.delete(key);
        if (removed) {
            logger.success(logger_1.LogMessages.CONTAINER_STOPPED, this.getContainerKey(key));
        }
        return removed;
    }
    /**
     * Clear all containers from the registry
     */
    clear() {
        this.containers.clear();
        logger.info(logger_1.LogMessages.PLATFORM_SHUTDOWN, 'All containers removed from registry');
    }
    /**
     * Get the number of registered containers
     */
    size() {
        return this.containers.size;
    }
    /**
     * Helper method to get a string representation of the container key
     */
    getContainerKey(key) {
        return typeof key === 'string' ? key : String(key);
    }
}
exports.ContainerRegistry = ContainerRegistry;
//# sourceMappingURL=container-registry.js.map