"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCliArgs = parseCliArgs;
exports.printHelp = printHelp;
const commander_1 = require("commander");
// Convert environment values like IT_VERBOSE/IT_CAPTURE_LOGS to booleans.
function toBoolean(raw, defaultValue = false) {
    if (raw === undefined)
        return defaultValue;
    return raw === 'true';
}
function buildProgram(env) {
    return (new commander_1.Command()
        .name('it-runner')
        .description('OneCX Integration Tests Runner')
        .usage('[options]')
        .allowUnknownOption(false)
        .allowExcessArguments(false)
        // Silence commander's default output because the runner controls user-facing output itself.
        .configureOutput({
        writeOut: () => undefined,
        writeErr: () => undefined,
    })
        // Throw instead of process.exit() so callers can handle CLI errors consistently.
        .exitOverride()
        .option('-v, --verbose', 'Enable verbose output', toBoolean(env.IT_VERBOSE, false))
        .option('--capture-logs', 'Capture runner console output to file', toBoolean(env.IT_CAPTURE_LOGS, true))
        .option('--dry-run', 'Print execution plan without running', false));
}
/**
 * Parse CLI arguments into normalized runner options.
 *
 * Uses environment variables as defaults where available:
 * - `IT_VERBOSE`
 * - `IT_CAPTURE_LOGS`
 *
 * @param argv User-provided CLI arguments (without node executable prefix).
 * @param env Process environment used for default values.
 * @returns Normalized CLI options for the integration test runner.
 */
function parseCliArgs(argv, env) {
    const program = buildProgram(env);
    try {
        program.parse(argv, { from: 'user' });
    }
    catch (error) {
        if (error &&
            typeof error === 'object' &&
            'code' in error &&
            error.code === 'commander.helpDisplayed') {
            const helpOptions = program.opts();
            return {
                verbose: Boolean(helpOptions.verbose),
                dryRun: false,
                captureLogsToFile: Boolean(helpOptions.captureLogs),
                help: true,
            };
        }
        if (error instanceof Error && error.message) {
            throw new Error(error.message.replace(/^error: /i, '').trim());
        }
        throw error;
    }
    if (program.args.length > 0) {
        throw new Error(`Unknown positional argument: ${String(program.args[0])}`);
    }
    const parsed = program.opts();
    const options = {
        verbose: Boolean(parsed.verbose),
        dryRun: Boolean(parsed.dryRun),
        captureLogsToFile: Boolean(parsed.captureLogs),
        // Help is handled via commander.exitOverride() in the catch block above.
        help: Boolean(parsed.help),
    };
    return options;
}
/**
 * Print generated CLI help text to stdout.
 *
 * @returns No return value.
 */
function printHelp() {
    console.log(buildProgram(process.env).helpInformation());
}
//# sourceMappingURL=cli.js.map