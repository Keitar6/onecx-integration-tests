/**
 * Utility class to verify that Docker images can be pulled successfully
 */
export declare class ImagePullChecker {
    private static readonly TIMEOUT_MS;
    /**
     * Verify that an image can be pulled successfully
     * @param imageName - The full image name including tag (e.g., 'nginx:latest')
     * @returns Promise that resolves to true if image can be pulled, false otherwise
     */
    static verifyImagePull(imageName: string): Promise<boolean>;
    /**
     * Verify multiple images can be pulled
     * @param imageNames - Array of image names to verify
     * @returns Promise that resolves to an object with results for each image
     */
    static verifyMultipleImages(imageNames: string[]): Promise<Record<string, boolean>>;
}
