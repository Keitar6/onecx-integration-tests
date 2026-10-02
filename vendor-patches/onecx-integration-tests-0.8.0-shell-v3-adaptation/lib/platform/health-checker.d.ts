import type { AllowedContainerTypes } from '../models/types/allowed-container.type';
import { ContainerHealthStatus, HeartbeatConfig } from '../models/interfaces/health-checker.interface';
export declare class HealthChecker {
    private heartbeatInterval?;
    private failureCountMap;
    private heartbeatConfig;
    /**
     * Configure heartbeat settings from platform configuration
     */
    configureHeartbeat(config?: HeartbeatConfig): void;
    /**
     * Check the health of all containers
     */
    checkAllHealthy(startedContainers: Map<string, AllowedContainerTypes>): Promise<ContainerHealthStatus[]>;
    /**
     * Check the health of one container using the strategy pattern
     */
    checkHealthy(startedContainers: Map<string, AllowedContainerTypes>, name: string): Promise<ContainerHealthStatus>;
    /**
     * Start heartbeat monitoring for containers
     */
    startHeartbeat(startedContainers: Map<string, AllowedContainerTypes>): void;
    /**
     * Stop heartbeat monitoring
     */
    stopHeartbeat(): void;
    /**
     * Check if heartbeat is currently running
     */
    isHeartbeatRunning(): boolean;
    /**
     * Get current heartbeat configuration
     */
    getHeartbeatConfig(): HeartbeatConfig;
    /**
     * Process a single heartbeat check cycle
     */
    private processHeartbeatCheck;
    /**
     * Process health check results and track failure counts
     */
    private processHealthResults;
    /**
     * Log summary of unhealthy containers
     */
    private logHealthSummary;
}
