"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartedTenantSvcContainer = exports.TenantSvcContainer = void 0;
const onecx_svc_1 = require("../basic/onecx-svc");
class TenantSvcContainer extends onecx_svc_1.SvcContainer {
    constructor(image, databaseContainer, keycloakContainer) {
        super(image, { databaseContainer, keycloakContainer });
        this.withNetworkAliases('onecx-tenant-svc')
            .withDatabaseUsername('onecx_tenant')
            .withDatabasePassword('onecx_tenant');
    }
}
exports.TenantSvcContainer = TenantSvcContainer;
class StartedTenantSvcContainer extends onecx_svc_1.StartedSvcContainer {
}
exports.StartedTenantSvcContainer = StartedTenantSvcContainer;
//# sourceMappingURL=onecx-tenant-svc.js.map