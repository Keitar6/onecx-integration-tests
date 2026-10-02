"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartedParameterBffContainer = exports.ParameterBffContainer = void 0;
const onecx_bff_1 = require("../basic/onecx-bff");
class ParameterBffContainer extends onecx_bff_1.BffContainer {
    constructor(image, keycloakContainer) {
        super(image, keycloakContainer);
        this.withPermissionsProductName('onecx-parameter').withNetworkAliases('onecx-parameter-bff');
    }
}
exports.ParameterBffContainer = ParameterBffContainer;
class StartedParameterBffContainer extends onecx_bff_1.StartedBffContainer {
}
exports.StartedParameterBffContainer = StartedParameterBffContainer;
//# sourceMappingURL=onecx-parameter-bff.js.map