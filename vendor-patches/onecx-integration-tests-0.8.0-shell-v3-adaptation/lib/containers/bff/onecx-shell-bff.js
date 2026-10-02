"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartedShellBffContainer = exports.ShellBffContainer = void 0;
const onecx_bff_1 = require("../basic/onecx-bff");
class ShellBffContainer extends onecx_bff_1.BffContainer {
    constructor(image, keycloakContainer) {
        super(image, keycloakContainer);
        this.withPermissionsProductName('onecx-shell').withNetworkAliases('onecx-shell-bff');
    }
}
exports.ShellBffContainer = ShellBffContainer;
class StartedShellBffContainer extends onecx_bff_1.StartedBffContainer {
}
exports.StartedShellBffContainer = StartedShellBffContainer;
//# sourceMappingURL=onecx-shell-bff.js.map