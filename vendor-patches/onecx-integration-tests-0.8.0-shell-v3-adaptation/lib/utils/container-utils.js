"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPortAwareContainer = isPortAwareContainer;
exports.isKeycloakContainer = isKeycloakContainer;
exports.isShellUiContainer = isShellUiContainer;
exports.isE2eContainer = isE2eContainer;
exports.getContainerId = getContainerId;
exports.getInternalPort = getInternalPort;
exports.getPlatformInfoExportDecision = getPlatformInfoExportDecision;
const onecx_keycloak_1 = require("../containers/core/onecx-keycloak");
const onecx_shell_ui_1 = require("../containers/ui/onecx-shell-ui");
const onecx_e2e_1 = require("../containers/e2e/onecx-e2e");
function isPortAwareContainer(container) {
    return 'getPort' in container && typeof container.getPort === 'function';
}
/** Type guard to check if container is a Keycloak container */
function isKeycloakContainer(container) {
    return container instanceof onecx_keycloak_1.StartedOnecxKeycloakContainer;
}
/** Type guard to check if container is a Shell UI container */
function isShellUiContainer(container) {
    return container instanceof onecx_shell_ui_1.StartedShellUiContainer;
}
/** Type guard to check if container is an E2E container */
function isE2eContainer(container) {
    return container instanceof onecx_e2e_1.StartedE2eContainer;
}
/** Get container id if available */
function getContainerId(container) {
    if ('getId' in container && typeof container.getId === 'function') {
        return container.getId();
    }
    return undefined;
}
/** Get internal port from a port-aware container by delegating to `getPort()`. */
function getInternalPort(container) {
    return container.getPort();
}
/**
 * Centralized decision whether a container should be included in platform-info export.
 */
function getPlatformInfoExportDecision(container) {
    if (isE2eContainer(container)) {
        return { include: false, reason: 'E2E runner has no service port mapping' };
    }
    if (!isPortAwareContainer(container)) {
        return { include: false, reason: 'Container does not expose getPort()' };
    }
    return { include: true };
}
//# sourceMappingURL=container-utils.js.map