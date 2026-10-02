import { StartedNetwork } from 'testcontainers';
import { StartedOnecxKeycloakContainer } from '../containers/core/onecx-keycloak';
import { StartedOnecxPostgresContainer } from '../containers/core/onecx-postgres';
import { PlatformConfig } from '../models/interfaces/platform-config.interface';
import { ImageResolver } from './image-resolver';
import { ContainerRegistry } from './container-registry';
import { LogFilePathProvider } from './platform-manager';
export declare class CoreContainerStarter {
    private imageResolver;
    private network;
    private containerRegistry;
    private readonly config;
    private readonly logFilePathProvider?;
    constructor(imageResolver: ImageResolver, network: StartedNetwork, containerRegistry: ContainerRegistry, config: PlatformConfig, logFilePathProvider?: LogFilePathProvider | undefined);
    /**
     * Start core container (PostgreSQL and Keycloak)
     */
    startCoreContainers(): Promise<void>;
    /**
     * Start service container based on configuration
     */
    startServiceContainers(postgres: StartedOnecxPostgresContainer, keycloak: StartedOnecxKeycloakContainer): Promise<void>;
    /**
     * Start BFF services based on configuration
     */
    startBffContainers(keycloak: StartedOnecxKeycloakContainer): Promise<void>;
    /**
     * Start UI container based on configuration
     */
    startUiContainers(keycloak: StartedOnecxKeycloakContainer): Promise<void>;
    private startPostgresContainer;
    private startKeycloakContainer;
    private startIamKcService;
    private startWorkspaceService;
    private startParameterService;
    private startUserProfileService;
    private startThemeService;
    private startTenantService;
    private startProductStoreService;
    private startPermissionService;
    private startShellBffService;
    private startWorkspaceBffService;
    private startParameterBffService;
    private startShellUiService;
    private startWorkspaceUiService;
}
