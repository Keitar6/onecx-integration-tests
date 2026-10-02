import { StartedOnecxKeycloakContainer } from '../containers/core/onecx-keycloak';
/**
 * Returns the common environment variables for UI containers, based on the provided Keycloak container.
 */
export declare function getCommonEnvironmentVariables(keycloakContainer: StartedOnecxKeycloakContainer): Record<string, string>;
