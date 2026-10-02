#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
const cli_1 = require("./cli/cli");
const runner_1 = require("./runner");
/**
 * CLI entrypoint for the integration test runner.
 *
 * Parses user flags, prints help when requested, executes the runner,
 * and exits with the resulting process exit code.
 *
 * @returns Resolves when the process exit flow has been initiated.
 */
async function main() {
    let options;
    try {
        options = (0, cli_1.parseCliArgs)(process.argv.slice(2), process.env);
    }
    catch (error) {
        console.error(`ERROR: ${error instanceof Error ? error.message : String(error)}`);
        (0, cli_1.printHelp)();
        process.exit(1);
        return;
    }
    if (options.help) {
        (0, cli_1.printHelp)();
        process.exit(0);
        return;
    }
    const runner = new runner_1.IntegrationTestsRunner(options);
    const exitCode = await runner.run();
    process.exit(exitCode);
}
main().catch((error) => {
    console.error(`ERROR: Fatal error: ${error}`);
    process.exit(1);
});
//# sourceMappingURL=index.js.map