"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveRunContextPaths = resolveRunContextPaths;
exports.applyRunContextEnv = applyRunContextEnv;
const tslib_1 = require("tslib");
const path = tslib_1.__importStar(require("path"));
const artifacts_1 = require("../config/artifacts");
function resolveRunContextPaths(root, runId) {
    const effectiveRunId = runId ?? process.env.RUN_ID ?? process.env.E2E_RUN_ID ?? artifacts_1.DEFAULT_RUN_ID;
    const artifactsRoot = (0, artifacts_1.resolveArtifactsRoot)(root);
    const runDir = (0, artifacts_1.resolveRunArtifactsDir)(root, effectiveRunId);
    return {
        artifactsRoot,
        runId: effectiveRunId,
        runDir,
        e2eDir: path.join(runDir, 'e2e'),
        e2eResultsDir: path.join(runDir, 'e2e-results'),
    };
}
function applyRunContextEnv(paths) {
    process.env.ARTIFACTS_ROOT = paths.artifactsRoot;
    process.env.E2E_BASE_DIR = paths.runDir;
    process.env.RUN_ID = paths.runId;
    process.env.E2E_RUN_ID = paths.runId;
    // backward compatibility
    process.env.artifacts_ROOT = paths.artifactsRoot;
}
//# sourceMappingURL=run-context.js.map