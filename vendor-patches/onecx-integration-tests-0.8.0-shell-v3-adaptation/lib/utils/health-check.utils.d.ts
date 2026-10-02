import { CommandHealthCheckConfig } from '../models/interfaces/testcontainers-health-check.adapter';
/**
 * Build complete health check URL with mapped port from command health check configuration.
 * Extracts protocol, host and path from the health check command and replaces the port
 * with the Docker-mapped port for external access.
 *
 * @example
 * ```typescript
 * const config = {
 *   test: ['CMD-SHELL', 'curl --head -fsS http://localhost:8080/q/health']
 * }
 * const url = buildHealthCheckUrl(32768, config)
 * // Returns: "http://localhost:32768/q/health"
 * ```
 *
 * @param mappedPort The Docker-mapped port to use for external access
 * @param config The command health check configuration
 * @returns Complete health check URL or null if no URL can be extracted
 */
export declare function buildHealthCheckUrl(mappedPort: number, config: CommandHealthCheckConfig): string | null;
