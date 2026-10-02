export declare const POSTGRES = "docker.io/library/postgres:13.4";
export declare const KEYCLOAK = "quay.io/keycloak/keycloak:23.0.4";
export declare const IMPORT_MANAGER_BASE = "docker.io/library/node:20";
export declare enum OnecxService {
    IAM_KC_SVC = "ghcr.io/onecx/onecx-iam-kc-svc:main",
    PARAMETER_SVC = "ghcr.io/onecx/onecx-parameter-svc:main",
    PERMISSION_SVC = "ghcr.io/onecx/onecx-permission-svc:main",
    PRODUCT_STORE_SVC = "ghcr.io/onecx/onecx-product-store-svc:main",
    TENANT_SVC = "ghcr.io/onecx/onecx-tenant-svc:main",
    THEME_SVC = "ghcr.io/onecx/onecx-theme-svc:main",
    WORKSPACE_SVC = "ghcr.io/onecx/onecx-workspace-svc:main",
    USER_PROFILE_SVC = "ghcr.io/onecx/onecx-user-profile-svc:main"
}
export declare enum OnecxBff {
    PARAMETER_BFF = "ghcr.io/onecx/onecx-parameter-bff:main",
    SHELL_BFF = "ghcr.io/onecx/onecx-shell-bff:main",
    WORKSPACE_BFF = "ghcr.io/onecx/onecx-workspace-bff:main"
}

export declare enum OnecxUi {
    SHELL_UI = "ghcr.io/onecx/onecx-shell-ui:2.x",
    WORKSPACE_UI = "ghcr.io/onecx/onecx-workspace-ui:main"
}
