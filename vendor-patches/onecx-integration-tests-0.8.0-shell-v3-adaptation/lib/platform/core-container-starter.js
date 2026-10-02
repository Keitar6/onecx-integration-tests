"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreContainerStarter = void 0;
const onecx_keycloak_1 = require("../containers/core/onecx-keycloak");
const onecx_postgres_1 = require("../containers/core/onecx-postgres");
const onecx_workspace_svc_1 = require("../containers/svc/onecx-workspace-svc");
const onecx_parameter_svc_1 = require("../containers/svc/onecx-parameter-svc");
const onecx_user_profile_svc_1 = require("../containers/svc/onecx-user-profile-svc");
const onecx_theme_svc_1 = require("../containers/svc/onecx-theme-svc");
const onecx_tenant_svc_1 = require("../containers/svc/onecx-tenant-svc");
const onecx_product_store_svc_1 = require("../containers/svc/onecx-product-store-svc");
const onecx_iam_kc_svc_1 = require("../containers/svc/onecx-iam-kc-svc");
const onecx_permission_svc_1 = require("../containers/svc/onecx-permission-svc");
const onecx_shell_bff_1 = require("../containers/bff/onecx-shell-bff");
const onecx_parameter_bff_1 = require("../containers/bff/onecx-parameter-bff");
const onecx_workspace_bff_1 = require("../containers/bff/onecx-workspace-bff");
const onecx_shell_ui_1 = require("../containers/ui/onecx-shell-ui");
const onecx_workspace_ui_1 = require("../containers/ui/onecx-workspace-ui");
const container_enum_1 = require("../models/enums/container.enum");
const env_1 = require("../config/env");
const logging_enable_1 = require("../utils/logging-enable");
const logger_1 = require("../utils/logger");
const logger = new logger_1.Logger('CoreContainerStarter');
class CoreContainerStarter {
    imageResolver;
    network;
    containerRegistry;
    config;
    logFilePathProvider;
    constructor(imageResolver, network, containerRegistry, config, logFilePathProvider) {
        this.imageResolver = imageResolver;
        this.network = network;
        this.containerRegistry = containerRegistry;
        this.config = config;
        this.logFilePathProvider = logFilePathProvider;
        // Platform config will be set globally by PlatformManager
    }
    /**
     * Start core container (PostgreSQL and Keycloak)
     */
    async startCoreContainers() {
        const postgres = await this.startPostgresContainer();
        this.containerRegistry.addContainer(container_enum_1.CONTAINER.POSTGRES, postgres);
        const keycloak = await this.startKeycloakContainer(postgres);
        this.containerRegistry.addContainer(container_enum_1.CONTAINER.KEYCLOAK, keycloak);
        logger.success(logger_1.LogMessages.CONTAINER_STARTED, 'Core services');
    }
    /**
     * Start service container based on configuration
     */
    async startServiceContainers(postgres, keycloak) {
        await this.startIamKcService(keycloak);
        await this.startParameterService(postgres, keycloak);
        await this.startWorkspaceService(postgres, keycloak);
        await this.startUserProfileService(postgres, keycloak);
        await this.startThemeService(postgres, keycloak);
        await this.startTenantService(postgres, keycloak);
        await this.startProductStoreService(postgres, keycloak);
        await this.startPermissionService(postgres, keycloak);
    }
    /**
     * Start BFF services based on configuration
     */
    async startBffContainers(keycloak) {
        await this.startShellBffService(keycloak);
        await this.startParameterBffService(keycloak);
        await this.startWorkspaceBffService(keycloak);
    }
    /**
     * Start UI container based on configuration
     */
    async startUiContainers(keycloak) {
        await this.startShellUiService(keycloak);
        await this.startWorkspaceUiService(keycloak);
    }
    // Private methods for starting individual services
    async startPostgresContainer() {
        const postgresImage = await this.imageResolver.getPostgresImage(this.config);
        return await new onecx_postgres_1.OnecxPostgresContainer(postgresImage)
            .withNetwork(this.network)
            .withLoggingEnabled((0, logging_enable_1.loggingEnabled)(this.config, [container_enum_1.CONTAINER.POSTGRES]))
            .withLogFilePath(this.logFilePathProvider?.(container_enum_1.CONTAINER.POSTGRES) || '')
            .start();
    }
    async startKeycloakContainer(postgres) {
        const keycloakImage = await this.imageResolver.getKeycloakImage(this.config);
        return await new onecx_keycloak_1.OnecxKeycloakContainer(keycloakImage, postgres, this.config)
            .withNetwork(this.network)
            .withLoggingEnabled((0, logging_enable_1.loggingEnabled)(this.config, [container_enum_1.CONTAINER.KEYCLOAK]))
            .withLogFilePath(this.logFilePathProvider?.(container_enum_1.CONTAINER.KEYCLOAK) || '')
            .start();
    }
    async startIamKcService(keycloak) {
        const iamKcImage = await this.imageResolver.getServiceImage(env_1.OnecxService.IAM_KC_SVC, this.config);
        const container = await new onecx_iam_kc_svc_1.IamKcContainer(iamKcImage, keycloak)
            .withNetwork(this.network)
            .withLoggingEnabled((0, logging_enable_1.loggingEnabled)(this.config, [container_enum_1.CONTAINER.IAMKC_SVC]))
            .withLogFilePath(this.logFilePathProvider?.(container_enum_1.CONTAINER.IAMKC_SVC) || '')
            .start();
        this.containerRegistry.addContainer(container_enum_1.CONTAINER.IAMKC_SVC, container);
    }
    async startWorkspaceService(postgres, keycloak) {
        const workspaceImage = await this.imageResolver.getServiceImage(env_1.OnecxService.WORKSPACE_SVC, this.config);
        const container = await new onecx_workspace_svc_1.WorkspaceSvcContainer(workspaceImage, postgres, keycloak)
            .withNetwork(this.network)
            .withLoggingEnabled((0, logging_enable_1.loggingEnabled)(this.config, [container_enum_1.CONTAINER.WORKSPACE_SVC]))
            .withLogFilePath(this.logFilePathProvider?.(container_enum_1.CONTAINER.WORKSPACE_SVC) || '')
            .start();
        this.containerRegistry.addContainer(container_enum_1.CONTAINER.WORKSPACE_SVC, container);
    }
    async startParameterService(postgres, keycloak) {
        const parameterImage = await this.imageResolver.getServiceImage(env_1.OnecxService.PARAMETER_SVC, this.config);
        const container = await new onecx_parameter_svc_1.ParameterSvcContainer(parameterImage, postgres, keycloak)
            .withNetwork(this.network)
            .withLoggingEnabled((0, logging_enable_1.loggingEnabled)(this.config, [container_enum_1.CONTAINER.PARAMETER_SVC]))
            .withLogFilePath(this.logFilePathProvider?.(container_enum_1.CONTAINER.PARAMETER_SVC) || '')
            .start();
        this.containerRegistry.addContainer(container_enum_1.CONTAINER.PARAMETER_SVC, container);
    }
    async startUserProfileService(postgres, keycloak) {
        const userProfileImage = await this.imageResolver.getServiceImage(env_1.OnecxService.USER_PROFILE_SVC, this.config);
        const container = await new onecx_user_profile_svc_1.UserProfileSvcContainer(userProfileImage, postgres, keycloak)
            .withNetwork(this.network)
            .withLoggingEnabled((0, logging_enable_1.loggingEnabled)(this.config, [container_enum_1.CONTAINER.USER_PROFILE_SVC]))
            .withLogFilePath(this.logFilePathProvider?.(container_enum_1.CONTAINER.USER_PROFILE_SVC) || '')
            .start();
        this.containerRegistry.addContainer(container_enum_1.CONTAINER.USER_PROFILE_SVC, container);
    }
    async startThemeService(postgres, keycloak) {
        const themeImage = await this.imageResolver.getServiceImage(env_1.OnecxService.THEME_SVC, this.config);
        const container = await new onecx_theme_svc_1.ThemeSvcContainer(themeImage, postgres, keycloak)
            .withNetwork(this.network)
            .withLoggingEnabled((0, logging_enable_1.loggingEnabled)(this.config, [container_enum_1.CONTAINER.THEME_SVC]))
            .withLogFilePath(this.logFilePathProvider?.(container_enum_1.CONTAINER.THEME_SVC) || '')
            .start();
        this.containerRegistry.addContainer(container_enum_1.CONTAINER.THEME_SVC, container);
    }
    async startTenantService(postgres, keycloak) {
        const tenantImage = await this.imageResolver.getServiceImage(env_1.OnecxService.TENANT_SVC, this.config);
        const container = await new onecx_tenant_svc_1.TenantSvcContainer(tenantImage, postgres, keycloak)
            .withNetwork(this.network)
            .withLoggingEnabled((0, logging_enable_1.loggingEnabled)(this.config, [container_enum_1.CONTAINER.TENANT_SVC]))
            .withLogFilePath(this.logFilePathProvider?.(container_enum_1.CONTAINER.TENANT_SVC) || '')
            .start();
        this.containerRegistry.addContainer(container_enum_1.CONTAINER.TENANT_SVC, container);
    }
    async startProductStoreService(postgres, keycloak) {
        const productStoreImage = await this.imageResolver.getServiceImage(env_1.OnecxService.PRODUCT_STORE_SVC, this.config);
        const container = await new onecx_product_store_svc_1.ProductStoreSvcContainer(productStoreImage, postgres, keycloak)
            .withNetwork(this.network)
            .withLoggingEnabled((0, logging_enable_1.loggingEnabled)(this.config, [container_enum_1.CONTAINER.PRODUCT_STORE_SVC]))
            .withLogFilePath(this.logFilePathProvider?.(container_enum_1.CONTAINER.PRODUCT_STORE_SVC) || '')
            .start();
        this.containerRegistry.addContainer(container_enum_1.CONTAINER.PRODUCT_STORE_SVC, container);
    }
    async startPermissionService(postgres, keycloak) {
        // Permission service depends on tenant service
        const tenantSvcContainer = this.containerRegistry.getContainer(container_enum_1.CONTAINER.TENANT_SVC);
        if (!tenantSvcContainer) {
            throw new Error('Permission service requires Tenant service to be started first');
        }
        const permissionImage = await this.imageResolver.getServiceImage(env_1.OnecxService.PERMISSION_SVC, this.config);
        const container = await new onecx_permission_svc_1.PermissionSvcContainer(permissionImage, postgres, keycloak, tenantSvcContainer)
            .withNetwork(this.network)
            .withLoggingEnabled((0, logging_enable_1.loggingEnabled)(this.config, [container_enum_1.CONTAINER.PERMISSION_SVC]))
            .withLogFilePath(this.logFilePathProvider?.(container_enum_1.CONTAINER.PERMISSION_SVC) || '')
            .start();
        this.containerRegistry.addContainer(container_enum_1.CONTAINER.PERMISSION_SVC, container);
    }
    async startShellBffService(keycloak) {
        const shellBffImage = await this.imageResolver.getBffImage(env_1.OnecxBff.SHELL_BFF, this.config);
        const container = await new onecx_shell_bff_1.ShellBffContainer(shellBffImage, keycloak)
            .withNetwork(this.network)
            .withLoggingEnabled((0, logging_enable_1.loggingEnabled)(this.config, [container_enum_1.CONTAINER.SHELL_BFF]))
            .withLogFilePath(this.logFilePathProvider?.(container_enum_1.CONTAINER.SHELL_BFF) || '')
            .start();
        this.containerRegistry.addContainer(container_enum_1.CONTAINER.SHELL_BFF, container);
    }
    async startWorkspaceBffService(keycloak) {
        const workspaceBffImage = await this.imageResolver.getBffImage(env_1.OnecxBff.WORKSPACE_BFF, this.config);
        const container = await new onecx_workspace_bff_1.WorkspaceBffContainer(workspaceBffImage, keycloak)
            .withNetwork(this.network)
            .withLoggingEnabled((0, logging_enable_1.loggingEnabled)(this.config, [container_enum_1.CONTAINER.WORKSPACE_BFF]))
            .withLogFilePath(this.logFilePathProvider?.(container_enum_1.CONTAINER.WORKSPACE_BFF) || '')
            .start();
        this.containerRegistry.addContainer(container_enum_1.CONTAINER.WORKSPACE_BFF, container);
    }
    async startParameterBffService(keycloak) {
        const parameterBffImage = await this.imageResolver.getBffImage(env_1.OnecxBff.PARAMETER_BFF, this.config);
        const container = await new onecx_parameter_bff_1.ParameterBffContainer(parameterBffImage, keycloak)
            .withNetwork(this.network)
            .withLoggingEnabled((0, logging_enable_1.loggingEnabled)(this.config, [container_enum_1.CONTAINER.PARAMETER_BFF]))
            .withLogFilePath(this.logFilePathProvider?.(container_enum_1.CONTAINER.PARAMETER_BFF) || '')
            .start();
        this.containerRegistry.addContainer(container_enum_1.CONTAINER.PARAMETER_BFF, container);
    }
    async startShellUiService(keycloak) {
        // Shell UI depends on Shell BFF
        const shellBffContainer = this.containerRegistry.getContainer(container_enum_1.CONTAINER.SHELL_BFF);
        if (!shellBffContainer) {
            throw new Error('Shell UI requires Shell BFF to be started first');
        }
        const shellUiImage = await this.imageResolver.getUiImage(env_1.OnecxUi.SHELL_UI, this.config);
        const container = await new onecx_shell_ui_1.ShellUiContainer(shellUiImage, keycloak)
            .withNetwork(this.network)
            .withLoggingEnabled((0, logging_enable_1.loggingEnabled)(this.config, [container_enum_1.CONTAINER.SHELL_UI]))
            .withLogFilePath(this.logFilePathProvider?.(container_enum_1.CONTAINER.SHELL_UI) || '')
            .start();
        this.containerRegistry.addContainer(container_enum_1.CONTAINER.SHELL_UI, container);
    }
    async startWorkspaceUiService(keycloak) {
        // Workspace UI depends on Workspace BFF
        const workspaceBffContainer = this.containerRegistry.getContainer(container_enum_1.CONTAINER.WORKSPACE_BFF);
        if (!workspaceBffContainer) {
            throw new Error('Workspace UI requires Workspace BFF to be started first');
        }
        const workspaceUiImage = await this.imageResolver.getUiImage(env_1.OnecxUi.WORKSPACE_UI, this.config);
        const container = await new onecx_workspace_ui_1.WorkspaceUiContainer(workspaceUiImage, keycloak)
            .withNetwork(this.network)
            .withLoggingEnabled((0, logging_enable_1.loggingEnabled)(this.config, [container_enum_1.CONTAINER.WORKSPACE_UI]))
            .withLogFilePath(this.logFilePathProvider?.(container_enum_1.CONTAINER.WORKSPACE_UI) || '')
            .start();
        this.containerRegistry.addContainer(container_enum_1.CONTAINER.WORKSPACE_UI, container);
    }
}
exports.CoreContainerStarter = CoreContainerStarter;
//# sourceMappingURL=core-container-starter.js.map