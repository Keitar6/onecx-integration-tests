"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.E2E_DEFAULT_TIMEOUT_MS = exports.E2E_CONTAINER_OUTPUT_PATH = exports.E2E_OUTPUT_DIR = void 0;
exports.getE2eOutputPath = getE2eOutputPath;
const tslib_1 = require("tslib");
const path = tslib_1.__importStar(require("path"));
/**
 * Constants for E2E test execution
 */
/**
 * Output directory name for E2E results
 */
exports.E2E_OUTPUT_DIR = 'e2e-results';
/**
 * Container path where E2E results are written inside the container
 */
exports.E2E_CONTAINER_OUTPUT_PATH = '/e2e-results';
/**
 * Default timeout for E2E container startup/termination wait in milliseconds.
 * 10 minutes is intended for slower CI/CD pipelines.
 * 1000 milli * 60 sec * 10 min
 */
exports.E2E_DEFAULT_TIMEOUT_MS = 1000 * 60 * 10;
/**
 * Get the absolute path for E2E output directory
 */
function getE2eOutputPath() {
    const baseDir = process.env.E2E_BASE_DIR?.trim();
    if (baseDir) {
        return path.resolve(baseDir, exports.E2E_OUTPUT_DIR);
    }
    return path.resolve(process.cwd(), exports.E2E_OUTPUT_DIR);
}
//# sourceMappingURL=e2e-constants.js.map