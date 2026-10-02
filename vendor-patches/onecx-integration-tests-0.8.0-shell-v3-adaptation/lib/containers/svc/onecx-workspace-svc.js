"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartedWorkspaceSvcContainer = exports.WorkspaceSvcContainer = void 0;
const onecx_svc_1 = require("../basic/onecx-svc");
class WorkspaceSvcContainer extends onecx_svc_1.SvcContainer {
    constructor(image, databaseContainer, keycloakContainer) {
        super(image, { databaseContainer, keycloakContainer });
        this.withEnvironment({
            TKIT_RS_CONTEXT_TENANT_ID_ENABLED: 'false',
        });
        this.withNetworkAliases('onecx-workspace-svc')
            .withDatabaseUsername('onecx_workspace')
            .withDatabasePassword('onecx_workspace');
    }
}
exports.WorkspaceSvcContainer = WorkspaceSvcContainer;
class StartedWorkspaceSvcContainer extends onecx_svc_1.StartedSvcContainer {
}
exports.StartedWorkspaceSvcContainer = StartedWorkspaceSvcContainer;
//# sourceMappingURL=onecx-workspace-svc.js.map