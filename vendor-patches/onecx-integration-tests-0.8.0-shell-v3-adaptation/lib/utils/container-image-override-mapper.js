"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerImageOverrideMapper = void 0;
const env_1 = require("../config/env");
/**
 * Maps container service names to their corresponding platform config image overrides
 */
class ContainerImageOverrideMapper {
    /**
     * Get image override for a service container
     */
    static getServiceImageOverride(serviceName, config) {
        const serviceImages = config.platformOverrides?.services;
        if (!serviceImages)
            return undefined;
        const overrideMap = {
            [env_1.OnecxService.IAM_KC_SVC]: serviceImages.iamKc?.image,
            [env_1.OnecxService.PARAMETER_SVC]: serviceImages.parameter?.image,
            [env_1.OnecxService.WORKSPACE_SVC]: serviceImages.workspace?.image,
            [env_1.OnecxService.USER_PROFILE_SVC]: serviceImages.userProfile?.image,
            [env_1.OnecxService.THEME_SVC]: serviceImages.theme?.image,
            [env_1.OnecxService.TENANT_SVC]: serviceImages.tenant?.image,
            [env_1.OnecxService.PRODUCT_STORE_SVC]: serviceImages.productStore?.image,
            [env_1.OnecxService.PERMISSION_SVC]: serviceImages.permission?.image,
        };
        return overrideMap[serviceName];
    }
    /**
     * Get image override for a BFF container
     */
    static getBffImageOverride(bffService, config) {
        const overrides = config.platformOverrides?.bff;
        if (!overrides)
            return undefined;
        const overrideMap = {
            [env_1.OnecxBff.PARAMETER_BFF]: overrides.parameter?.image,
            [env_1.OnecxBff.SHELL_BFF]: overrides.shell?.image,
            [env_1.OnecxBff.WORKSPACE_BFF]: overrides.workspace?.image,
        };
        return overrideMap[bffService];
    }
    /**
     * Get image override for a UI container
     */
    static getUiImageOverride(uiService, config) {
        const overrides = config.platformOverrides?.ui;
        if (!overrides)
            return undefined;
        const overrideMap = {
            [env_1.OnecxUi.SHELL_UI]: overrides.shell?.image,
            [env_1.OnecxUi.WORKSPACE_UI]: overrides.workspace?.image,
        };
        return overrideMap[uiService];
    }
}
exports.ContainerImageOverrideMapper = ContainerImageOverrideMapper;
//# sourceMappingURL=container-image-override-mapper.js.map