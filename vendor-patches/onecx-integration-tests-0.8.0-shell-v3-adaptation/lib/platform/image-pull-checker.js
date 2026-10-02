"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagePullChecker = void 0;
const testcontainers_1 = require("testcontainers");
const logger_1 = require("../utils/logger");
const logger = new logger_1.Logger('ImagePullChecker');
/**
 * Utility class to verify that Docker images can be pulled successfully
 */
class ImagePullChecker {
    static TIMEOUT_MS = 30000; // 1/2 minute timeout for image pull
    /**
     * Verify that an image can be pulled successfully
     * @param imageName - The full image name including tag (e.g., 'nginx:latest')
     * @returns Promise that resolves to true if image can be pulled, false otherwise
     */
    static async verifyImagePull(imageName) {
        try {
            logger.info(`${logger_1.LogMessages.IMAGE_PULL_START}: ${imageName}`);
            // Create a minimal container just to verify the image can be pulled
            // We'll use a simple approach: try to create the container and immediately stop it
            const container = new testcontainers_1.GenericContainer(imageName).withCommand(['sh', '-c', 'exit 0']); // Simple command that exits immediately
            // Start the container with timeout
            const startedContainer = await Promise.race([
                container.start(),
                new Promise((_, reject) => setTimeout(() => reject(new Error(`Image pull timeout after ${this.TIMEOUT_MS}ms`)), this.TIMEOUT_MS)),
            ]);
            // If we get here, the image was pulled successfully
            logger.success(`${logger_1.LogMessages.IMAGE_PULL_SUCCESS}: ${imageName}`);
            // Immediately stop and remove the container
            await startedContainer.stop();
            return true;
        }
        catch (error) {
            logger.error(`${logger_1.LogMessages.IMAGE_PULL_FAILED}: ${imageName}`, undefined, error);
            return false;
        }
    }
    /**
     * Verify multiple images can be pulled
     * @param imageNames - Array of image names to verify
     * @returns Promise that resolves to an object with results for each image
     */
    static async verifyMultipleImages(imageNames) {
        const results = {};
        // Check images in parallel for better performance
        const promises = imageNames.map(async (imageName) => {
            const result = await this.verifyImagePull(imageName);
            results[imageName] = result;
            return { imageName, result };
        });
        await Promise.allSettled(promises);
        return results;
    }
}
exports.ImagePullChecker = ImagePullChecker;
//# sourceMappingURL=image-pull-checker.js.map