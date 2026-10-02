"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartedWorkspaceUiContainer = exports.WorkspaceUiContainer = void 0;
const common_env_utils_1 = require("../../utils/common-env.utils");
const onecx_ui_1 = require("../basic/onecx-ui");
class WorkspaceUiContainer extends onecx_ui_1.UiContainer {
    keycloakContainer;
    client_user_id = 'onecx-workspace-ui-client';
    constructor(image, keycloakContainer) {
        super(image);
        this.keycloakContainer = keycloakContainer;
        this.withEnvironment({
            ONECX_PERMISSIONS_ENABLED: 'true',
            ONECX_PERMISSIONS_CACHE_ENABLED: 'false',
            ONECX_PERMISSIONS_PRODUCT_NAME: 'onecx-workspace',
            KEYCLOAK_URL: `https://${keycloakContainer.getNetworkAliases()[0]}:8443`,
            ONECX_VAR_REMAP: 'KEYCLOAK_REALM=KC_REALM;KEYCLOAK_CLIENT_ID=CLIENT_USER_ID',
            CLIENT_USER_ID: `${this.client_user_id}`,
        })
            .withEnvironment((0, common_env_utils_1.getCommonEnvironmentVariables)(this.keycloakContainer))
            .withNetworkAliases('onecx-workspace-ui')
            .withAppBaseHref('/')
            .withAppId('onecx-workspace-ui')
            .withProductName('onecx-workspace');
    }
    async start() {
        const startedUiContainer = await super.start();
        return new StartedWorkspaceUiContainer(startedUiContainer, this.client_user_id);
    }
}
exports.WorkspaceUiContainer = WorkspaceUiContainer;
class StartedWorkspaceUiContainer extends onecx_ui_1.StartedUiContainer {
    clientUserId;
    constructor(startedUiContainer, clientUserId) {
        super(startedUiContainer.getStartedTestContainer(), startedUiContainer.getDetails(), startedUiContainer.getNetworkAliases(), startedUiContainer.getPort(), startedUiContainer.getCommandHealthCheck(), startedUiContainer.getHealthCheckConfigs());
        this.clientUserId = clientUserId;
    }
    getClientUserId() {
        return this.clientUserId;
    }
}
exports.StartedWorkspaceUiContainer = StartedWorkspaceUiContainer;
//# sourceMappingURL=onecx-workspace-ui.js.map