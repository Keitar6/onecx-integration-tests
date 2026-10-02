"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartedParameterSvcContainer = exports.ParameterSvcContainer = void 0;
const onecx_svc_1 = require("../basic/onecx-svc");
class ParameterSvcContainer extends onecx_svc_1.SvcContainer {
    constructor(image, databaseContainer, keycloakContainer) {
        super(image, { databaseContainer, keycloakContainer });
        this.withEnvironment({
            TKIT_RS_CONTEXT_TENANT_ID_ENABLED: 'false',
        });
        this.withNetworkAliases('onecx-parameter-svc')
            .withDatabaseUsername('onecx_parameter')
            .withDatabasePassword('onecx_parameter');
    }
}
exports.ParameterSvcContainer = ParameterSvcContainer;
class StartedParameterSvcContainer extends onecx_svc_1.StartedSvcContainer {
}
exports.StartedParameterSvcContainer = StartedParameterSvcContainer;
//# sourceMappingURL=onecx-parameter-svc.js.map