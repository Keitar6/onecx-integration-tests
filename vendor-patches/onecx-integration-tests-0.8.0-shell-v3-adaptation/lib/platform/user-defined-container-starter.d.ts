import { StartedNetwork } from 'testcontainers';
import { PlatformConfig } from '../models/interfaces/platform-config.interface';
import { E2eExecutionContext, E2eExecutionRecord } from '../models/interfaces/e2e.interface';
import { StartedOnecxPostgresContainer } from '../containers/core/onecx-postgres';
import { StartedOnecxKeycloakContainer } from '../containers/core/onecx-keycloak';
import { ImageResolver } from './image-resolver';
import { ContainerRegistry } from './container-registry';
import { LogFilePathProvider } from './platform-manager';
/**
 * UserDefinedContainerStarter class for creating different types of containers based on configuration
 */
export declare class UserDefinedContainerStarter {
    private network;
    private imageResolver;
    private containerRegistry;
    private postgres?;
    private keycloak?;
    private readonly logFilePathProvider?;
    private e2eExecutionHandler;
    constructor(network: StartedNetwork, imageResolver: ImageResolver, containerRegistry: ContainerRegistry, postgres?: StartedOnecxPostgresContainer | undefined, keycloak?: StartedOnecxKeycloakContainer | undefined, logFilePathProvider?: LogFilePathProvider | undefined);
    /**
     * Create containers based on the platform configuration
     * @param config Platform configuration containing container definitions
     * @returns Map of created and started containers
     */
    createAndStartContainers(config: PlatformConfig): Promise<void>;
    /**
     * Run E2E tests in configured order after the platform is healthy.
     * Failures in E2E containers are logged and execution continues with the next container.
     * @param config Platform configuration containing E2E container definitions
     * @returns Ordered E2E execution records, or undefined if no E2E is configured
     */
    startE2eContainers(config: PlatformConfig, shouldStop?: () => boolean): Promise<E2eExecutionRecord[] | undefined>;
    /**
     * Validate E2E configuration
     * @returns null if no e2e config, 'empty' if empty array, or the e2e configs array if valid
     */
    private validateE2eConfig;
    /**
     * Execute E2E containers in sequence. Each failure is logged and execution continues.
     */
    private executeE2eSequence;
    /**
     * Log E2E container execution result
     */
    private logE2eResult;
    /**
     * Create a service container from the configuration
     */
    private createSvcContainer;
    /**
     * Create a BFF container from the configuration
     */
    private createBffContainer;
    /**
     * Create a UI container from the configuration
     */
    private createUiContainer;
    /**
     * Start E2E test container and wait for it to complete.
     * Captures both successful and failed executions for reporting.
     * @param e2eConfig E2E container configuration
     * @param withLoggingEnabled Whether to enable container logging
     * @returns E2E execution result for one configured container
     */
    createE2eContainer(context: E2eExecutionContext): Promise<E2eExecutionRecord>;
    /**
     * Run E2E container and determine result from exit code
     */
    private runE2eContainerWithResult;
    /**
     * Configure E2E container with all settings from config
     */
    private configureE2eContainer;
}
