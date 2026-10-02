"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageResolver = void 0;
const env_1 = require("../config/env");
const image_pull_checker_1 = require("./image-pull-checker");
const container_image_override_mapper_1 = require("../utils/container-image-override-mapper");
const logger_1 = require("../utils/logger");
const logger = new logger_1.Logger('ImageResolver');
/**
 * Resolves the actual image name to use based on the configuration and any version overrides
 */
class ImageResolver {
    constructor() {
        // Platform config will be set globally by PlatformManager
    }
    /**
     * Get the PostgreSQL image with optional image override
     */
    async getPostgresImage(config) {
        return this.getImageWithOverride(env_1.POSTGRES, config.platformOverrides?.core?.postgres?.image);
    }
    /**
     * Get the Keycloak image with optional image override
     */
    async getKeycloakImage(config) {
        return this.getImageWithOverride(env_1.KEYCLOAK, config.platformOverrides?.core?.keycloak?.image);
    }
    /**
     * Get the Node.js image with optional image override
     */
    async getImportManagerBaseImage(config) {
        return this.getImageWithOverride(env_1.IMPORT_MANAGER_BASE, config.platformOverrides?.core?.importmanager?.image);
    }
    /**
     * Get a service image with optional image override
     */
    async getServiceImage(serviceName, config) {
        const defaultImage = serviceName;
        const overrideImage = container_image_override_mapper_1.ContainerImageOverrideMapper.getServiceImageOverride(serviceName, config);
        return this.getImageWithOverride(defaultImage, overrideImage);
    }
    /**
     * Get a bff container image with optional image override
     */
    async getBffImage(bffService, config) {
        const defaultImage = bffService;
        const overrideImage = container_image_override_mapper_1.ContainerImageOverrideMapper.getBffImageOverride(bffService, config);
        return this.getImageWithOverride(defaultImage, overrideImage);
    }
    /**
     * Get a ui container image with optional image override
     */
    async getUiImage(uiService, config) {
        const defaultImage = uiService;
        const overrideImage = container_image_override_mapper_1.ContainerImageOverrideMapper.getUiImageOverride(uiService, config);
        return this.getImageWithOverride(defaultImage, overrideImage);
    }
    /**
     * Resolve a custom image (used for container factory configurations)
     * This method returns the image as-is since custom images are already specified
     */
    async getImage(imageName) {
        // For integration tests, we'll be more lenient with custom images
        // In a real environment, you might want to enable strict verification
        const imageIsVerified = await this.verifyImage(imageName);
        if (imageIsVerified) {
            logger.success(`${logger_1.LogMessages.IMAGE_VERIFY_SUCCESS}: ${imageName}`);
            return imageName;
        }
        // Log warning but don't fail - let the container startup handle the failure
        logger.warn(logger_1.LogMessages.IMAGE_VERIFY_FAILED, `Image may not be available: ${imageName}`);
        logger.info(`${logger_1.LogMessages.IMAGE_PULL_START}: Proceeding with unverified image ${imageName}`);
        return imageName;
    }
    async verifyImage(image) {
        return await image_pull_checker_1.ImagePullChecker.verifyImagePull(image);
    }
    /**
     * Get any image with optional override and fallback to default
     */
    async getImageWithOverride(defaultImage, overrideImage) {
        const finalImage = overrideImage || defaultImage;
        const imageIsVerified = await this.verifyImage(finalImage);
        if (imageIsVerified) {
            return finalImage;
        }
        // If verification fails, fall back to default image
        logger.warn(logger_1.LogMessages.IMAGE_VERIFY_FAILED, `${overrideImage} -> ${defaultImage}`);
        return defaultImage;
    }
}
exports.ImageResolver = ImageResolver;
//# sourceMappingURL=image-resolver.js.map