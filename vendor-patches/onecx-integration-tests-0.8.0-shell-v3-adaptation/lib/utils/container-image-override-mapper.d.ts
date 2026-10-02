import { OnecxService, OnecxBff, OnecxUi } from '../config/env';
import { PlatformConfig } from '../models/interfaces/platform-config.interface';
/**
 * Maps container service names to their corresponding platform config image overrides
 */
export declare class ContainerImageOverrideMapper {
    /**
     * Get image override for a service container
     */
    static getServiceImageOverride(serviceName: OnecxService, config: PlatformConfig): string | undefined;
    /**
     * Get image override for a BFF container
     */
    static getBffImageOverride(bffService: OnecxBff, config: PlatformConfig): string | undefined;
    /**
     * Get image override for a UI container
     */
    static getUiImageOverride(uiService: OnecxUi, config: PlatformConfig): string | undefined;
}
