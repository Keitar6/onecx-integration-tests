"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnecxUi = exports.OnecxBff = exports.OnecxService = exports.IMPORT_MANAGER_BASE = exports.KEYCLOAK = exports.POSTGRES = void 0;
const DOCKER_REPO = 'ghcr.io/onecx';
const DEFAULT_TAG = 'main';
// External Images
exports.POSTGRES = 'docker.io/library/postgres:13.4';
exports.KEYCLOAK = 'quay.io/keycloak/keycloak:23.0.4';
exports.IMPORT_MANAGER_BASE = 'docker.io/library/node:20';
var OnecxService;
(function (OnecxService) {
    OnecxService["IAM_KC_SVC"] = "ghcr.io/onecx/onecx-iam-kc-svc:main";
    OnecxService["PARAMETER_SVC"] = "ghcr.io/onecx/onecx-parameter-svc:main";
    OnecxService["PERMISSION_SVC"] = "ghcr.io/onecx/onecx-permission-svc:main";
    OnecxService["PRODUCT_STORE_SVC"] = "ghcr.io/onecx/onecx-product-store-svc:main";
    OnecxService["TENANT_SVC"] = "ghcr.io/onecx/onecx-tenant-svc:main";
    OnecxService["THEME_SVC"] = "ghcr.io/onecx/onecx-theme-svc:main";
    OnecxService["WORKSPACE_SVC"] = "ghcr.io/onecx/onecx-workspace-svc:main";
    OnecxService["USER_PROFILE_SVC"] = "ghcr.io/onecx/onecx-user-profile-svc:main";
})(OnecxService || (exports.OnecxService = OnecxService = {}));
var OnecxBff;
(function (OnecxBff) {
    OnecxBff["PARAMETER_BFF"] = "ghcr.io/onecx/onecx-parameter-bff:main";
    OnecxBff["SHELL_BFF"] = "ghcr.io/onecx/onecx-shell-bff:main";
    OnecxBff["WORKSPACE_BFF"] = "ghcr.io/onecx/onecx-workspace-bff:main";
})(OnecxBff || (exports.OnecxBff = OnecxBff = {}));
var OnecxUi;
(function (OnecxUi) {
    OnecxUi["SHELL_UI"] = "ghcr.io/onecx/onecx-shell-ui:2.x";
    OnecxUi["WORKSPACE_UI"] = "ghcr.io/onecx/onecx-workspace-ui:main";
})(OnecxUi || (exports.OnecxUi = OnecxUi = {}));
//# sourceMappingURL=env.js.map