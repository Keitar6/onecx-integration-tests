export interface RunContextPaths {
    artifactsRoot: string;
    runId: string;
    runDir: string;
    e2eDir: string;
    e2eResultsDir: string;
}
export declare function resolveRunContextPaths(root?: string, runId?: string): RunContextPaths;
export declare function applyRunContextEnv(paths: RunContextPaths): void;
