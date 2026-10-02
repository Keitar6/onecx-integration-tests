export declare const DEFAULT_ARTEFACTS_ROOT = "integration-tests";
export declare const DEFAULT_RUN_ID: string;
export declare const RUNS_DIR = "artifacts";
export declare function resolveArtifactsRoot(root?: string): string;
export declare function resolveRunArtifactsDir(root?: string, runId?: string): string;
