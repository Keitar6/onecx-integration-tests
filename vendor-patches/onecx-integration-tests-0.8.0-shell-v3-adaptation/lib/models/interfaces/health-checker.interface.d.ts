/**
 * Result of checking a container's health status
 */
export interface ContainerHealthStatus {
    name: string;
    healthy: boolean;
}
export interface HeartbeatConfig {
    enabled: boolean;
    interval?: number;
    failureThreshold?: number;
}
