import { OnecxBff, OnecxUi, OnecxService } from '../config/env';
import { PlatformConfig } from '../models/interfaces/platform-config.interface';
/**
 * Resolves the actual image name to use based on the configuration and any version overrides
 */
export declare class ImageResolver {
    constructor();
    /**
     * Get the PostgreSQL image with optional image override
     */
    getPostgresImage(config: PlatformConfig): Promise<string>;
    /**
     * Get the Keycloak image with optional image override
     */
    getKeycloakImage(config: PlatformConfig): Promise<string>;
    /**
     * Get the Node.js image with optional image override
     */
    getImportManagerBaseImage(config: PlatformConfig): Promise<string>;
    /**
     * Get a service image with optional image override
     */
    getServiceImage(serviceName: OnecxService, config: PlatformConfig): Promise<string>;
    /**
     * Get a bff container image with optional image override
     */
    getBffImage(bffService: OnecxBff, config: PlatformConfig): Promise<string>;
    /**
     * Get a ui container image with optional image override
     */
    getUiImage(uiService: OnecxUi, config: PlatformConfig): Promise<string>;
    /**
     * Resolve a custom image (used for container factory configurations)
     * This method returns the image as-is since custom images are already specified
     */
    getImage(imageName: string): Promise<string>;
    verifyImage(image: string): Promise<boolean>;
    /**
     * Get any image with optional override and fallback to default
     */
    private getImageWithOverride;
}
