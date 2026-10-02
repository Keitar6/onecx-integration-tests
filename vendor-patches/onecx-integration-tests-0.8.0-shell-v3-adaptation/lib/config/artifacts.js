"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RUNS_DIR = exports.DEFAULT_RUN_ID = exports.DEFAULT_ARTEFACTS_ROOT = void 0;
exports.resolveArtifactsRoot = resolveArtifactsRoot;
exports.resolveRunArtifactsDir = resolveRunArtifactsDir;
const tslib_1 = require("tslib");
const path = tslib_1.__importStar(require("path"));
exports.DEFAULT_ARTEFACTS_ROOT = 'integration-tests';
exports.DEFAULT_RUN_ID = process.env.RUN_ID || process.env.E2E_RUN_ID || 'run';
exports.RUNS_DIR = 'artifacts';
function resolveArtifactsRoot(root) {
    return path.resolve(process.cwd(), root ?? exports.DEFAULT_ARTEFACTS_ROOT);
}
function resolveRunArtifactsDir(root, runId) {
    return path.join(resolveArtifactsRoot(root), exports.RUNS_DIR, runId ?? exports.DEFAULT_RUN_ID);
}
//# sourceMappingURL=artifacts.js.map