"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartedPermissionSvcContainer = exports.PermissionSvcContainer = void 0;
const onecx_svc_1 = require("../basic/onecx-svc");
class PermissionSvcContainer extends onecx_svc_1.SvcContainer {
    constructor(image, databaseContainer, keycloakContainer, tenantSvcContainer) {
        super(image, { databaseContainer, keycloakContainer });
        this.withEnvironment({
            QUARKUS_REST_CLIENT__TENANT_URL: `https://${tenantSvcContainer.getNetworkAliases()[0]}:${tenantSvcContainer.getPort()}`,
            ONECX_PERMISSION_TOKEN_VERIFIED: 'false',
            TKIT_RS_CONTEXT_TENANT_ID_ENABLED: 'false',
        });
        this.withNetworkAliases('onecx-permission-svc')
            .withDatabaseUsername('onecx_permission')
            .withDatabasePassword('onecx_permission');
    }
}
exports.PermissionSvcContainer = PermissionSvcContainer;
class StartedPermissionSvcContainer extends onecx_svc_1.StartedSvcContainer {
}
exports.StartedPermissionSvcContainer = StartedPermissionSvcContainer;
//# sourceMappingURL=onecx-permission-svc.js.map