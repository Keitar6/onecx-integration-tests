"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartedIamKcSvcContainer = exports.IamKcContainer = void 0;
const onecx_svc_1 = require("../basic/onecx-svc");
class IamKcContainer extends onecx_svc_1.SvcContainer {
    constructor(image, keycloakContainer) {
        super(image, { keycloakContainer });
        this.withEnvironment({
            QUARKUS_KEYCLOAK_ADMIN_CLIENT_SERVER_URL: `http://${keycloakContainer.getNetworkAliases()[0]}:${keycloakContainer.getPort()}`,
            QUARKUS_KEYCLOAK_ADMIN_CLIENT_REALM: `${keycloakContainer.getAdminRealm()}`,
            QUARKUS_KEYCLOAK_ADMIN_CLIENT_USERNAME: `${keycloakContainer.getAdminUsername()}`,
            QUARKUS_KEYCLOAK_ADMIN_CLIENT_PASSWORD: `${keycloakContainer.getAdminPassword()}`,
        });
        this.createDatabaseAtStart(false);
        this.withNetworkAliases('onecx-iam-kc-svc');
    }
}
exports.IamKcContainer = IamKcContainer;
class StartedIamKcSvcContainer extends onecx_svc_1.StartedSvcContainer {
}
exports.StartedIamKcSvcContainer = StartedIamKcSvcContainer;
//# sourceMappingURL=onecx-iam-kc-svc.js.map