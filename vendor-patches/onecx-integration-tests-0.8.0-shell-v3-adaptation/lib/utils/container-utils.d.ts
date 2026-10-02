import { StartedOnecxKeycloakContainer } from '../containers/core/onecx-keycloak';
import { StartedShellUiContainer } from '../containers/ui/onecx-shell-ui';
import { StartedE2eContainer } from '../containers/e2e/onecx-e2e';
import type { AllowedContainerTypes, PortAwareContainer } from '../models/types/allowed-container.type';
import { PlatformInfoExportDecision } from '../models/interfaces/platform-info-exporter.interface';
export declare function isPortAwareContainer(container: AllowedContainerTypes): container is PortAwareContainer;
/** Type guard to check if container is a Keycloak container */
export declare function isKeycloakContainer(container: AllowedContainerTypes): container is StartedOnecxKeycloakContainer;
/** Type guard to check if container is a Shell UI container */
export declare function isShellUiContainer(container: AllowedContainerTypes): container is StartedShellUiContainer;
/** Type guard to check if container is an E2E container */
export declare function isE2eContainer(container: AllowedContainerTypes): container is StartedE2eContainer;
/** Get container id if available */
export declare function getContainerId(container: AllowedContainerTypes): string | undefined;
/** Get internal port from a port-aware container by delegating to `getPort()`. */
export declare function getInternalPort(container: PortAwareContainer): number;
/**
 * Centralized decision whether a container should be included in platform-info export.
 */
export declare function getPlatformInfoExportDecision(container: AllowedContainerTypes): PlatformInfoExportDecision;
