'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getCommonEnvironmentVariables = getCommonEnvironmentVariables;
/**
 * Returns the common environment variables for UI containers, based on the provided Keycloak container.
 */
function getCommonEnvironmentVariables(keycloakContainer) {
  return {
    KC_REALM: `${keycloakContainer.getRealm()}`,
    QUARKUS_OIDC_AUTH_SERVER_URL: `http://${
      keycloakContainer.getNetworkAliases()[0]
    }:${keycloakContainer.getPort()}/realms/${keycloakContainer.getRealm()}`,
    // LOCAL PATCH (patch-package): must match Keycloak's fixed KC_HOSTNAME (https:8443), not the
    // plain http:8080 auth-server-url used for reachability/discovery, or token validation fails.
    QUARKUS_OIDC_TOKEN_ISSUER: `https://${
      keycloakContainer.getNetworkAliases()[0]
    }:8443/realms/${keycloakContainer.getRealm()}`,
    TKIT_SECURITY_AUTH_ENABLED: 'false',
    TKIT_RS_CONTEXT_TENANT_ID_MOCK_ENABLED: 'false',
    TKIT_LOG_JSON_ENABLED: 'false',
    TKIT_OIDC_HEALTH_ENABLED: 'false',
  };
}
//# sourceMappingURL=common-env.utils.js.map
