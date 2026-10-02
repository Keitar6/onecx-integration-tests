"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartedWorkspaceBffContainer = exports.WorkspaceBffContainer = void 0;
const onecx_bff_1 = require("../basic/onecx-bff");
class WorkspaceBffContainer extends onecx_bff_1.BffContainer {
    constructor(image, keycloakContainer) {
        super(image, keycloakContainer);
        this.withPermissionsProductName('onecx-workspace').withNetworkAliases('onecx-workspace-bff');
    }
}
exports.WorkspaceBffContainer = WorkspaceBffContainer;
class StartedWorkspaceBffContainer extends onecx_bff_1.StartedBffContainer {
}
exports.StartedWorkspaceBffContainer = StartedWorkspaceBffContainer;
//# sourceMappingURL=onecx-workspace-bff.js.map