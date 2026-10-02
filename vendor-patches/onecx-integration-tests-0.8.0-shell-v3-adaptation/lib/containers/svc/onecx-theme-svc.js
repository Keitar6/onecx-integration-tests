"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartedThemeSvcContainer = exports.ThemeSvcContainer = void 0;
const onecx_svc_1 = require("../basic/onecx-svc");
class ThemeSvcContainer extends onecx_svc_1.SvcContainer {
    constructor(image, databaseContainer, keycloakContainer) {
        super(image, { databaseContainer, keycloakContainer });
        this.withNetworkAliases('onecx-theme-svc').withDatabaseUsername('onecx_theme').withDatabasePassword('onecx_theme');
    }
}
exports.ThemeSvcContainer = ThemeSvcContainer;
class StartedThemeSvcContainer extends onecx_svc_1.StartedSvcContainer {
}
exports.StartedThemeSvcContainer = StartedThemeSvcContainer;
//# sourceMappingURL=onecx-theme-svc.js.map