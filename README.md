# onecx-integration-tests

OneCX integration test toolkit for starting a local platform stack (via Testcontainers), validating health, and optionally executing E2E tests.

## What this project provides

- A programmatic API (`PlatformManager`) to orchestrate platform containers.
- A CLI runner (published as the `onecx-it-runner` entry) for end-to-end integration test execution.
- Config-driven startup with default lookup at `integration-tests/platform/platform.json`.
- Run artifacts with summaries, logs, reports, and E2E outputs.

## Installation

The package is **self-contained**: install it as a single dependency and you get the complete runtime closure. You do **not** declare `testcontainers`, `dockerode`, or `axios` yourself — they are normal dependencies of this package, not peer dependencies.

From the npm registry (the canonical install):

```sh
npm install @onecx/integration-tests
```

From a packed tarball (the built package, as produced by the release build):

```sh
npm install ./onecx-integration-tests-<version>.tgz
```

The installed package provides the `onecx-it-runner` CLI entry, which resolves inside the built package layout.

## Public API

The package currently exports the following symbol from `src/index.ts`:

- `PlatformManager`

## Prerequisites

- Node.js and npm
- Docker (required for Testcontainers-based execution)

## Quick Start

Install dependencies:

```sh
npm install
```

Run the integration test runner:

```sh
npm run it:run
```

Run a dry run (validation + mode detection only):

```sh
npm run it:run -- --dry-run
```

Run with verbose output and log capture:

```sh
npm run it:run -- --verbose --capture-logs
```

Show CLI help:

```sh
npm run it:run -- --help
```

## Runner behavior

- **E2E mode**: If `platformConfig.container.e2e` contains entries, the runner starts the platform, waits for health checks, runs E2E containers sequentially in array order, then shuts down.
- **Graceful shutdown**: On `SIGINT` or `SIGTERM`, the runner finishes the current step, skips remaining E2E containers, cleans up the platform, and records `interruptedBy` in `summary.json`.
- **Platform-only mode**: If no E2E container is configured, the runner starts and validates the platform, collects artifacts, then shuts down.
- **Dry-run mode** (`--dry-run`): Validates and resolves configuration, determines run mode, creates run artifact directories, and exits without starting containers.

## Running the runner

The runner is invoked the same way in this repository and by a consumer; the only difference is how the entry resolves.

- **In this repository** the entry is wrapped as `npm run it:run` (runs the TypeScript source directly).
- **As a consumer** the published CLI entry is `onecx-it-runner` (the `bin` entry of the installed package). Run it directly or via `npx` after `npm install @onecx/integration-tests`:

```sh
onecx-it-runner [options]
# or
npx onecx-it-runner [options]
```

The entry is a working, self-resolving `bin` (it resolves inside the installed package layout; you do not reach into `node_modules` by hand).

### CLI options

| Option           | Description                           | Default |
| ---------------- | ------------------------------------- | ------- |
| `-v, --verbose`  | Enable verbose output                 | `false` |
| `--capture-logs` | Capture runner console output to file | `true` |
| `--dry-run`      | Print execution plan without running  | `false` |
| `-h, --help`     | Show help                             | `false` |

## Supported environment variables

| Variable          | Description                                     |
| ----------------- | ----------------------------------------------- |
| `IT_VERBOSE`      | Default for `--verbose` (`true` / `false`)      |
| `IT_CAPTURE_LOGS` | Default for `--capture-logs` (`true` / `false`) |

## Configuration

- Default config path: `integration-tests/platform/platform.json`
- If no explicit config path is provided, the validator first checks the default path and then searches recursively from the current working directory for files matching `*platform.json`.
- The config is validated against the project schema before execution.
- If no valid config is found, the runner exits with status `failure`.

## Consumer dry-run check

The dry-run mode is the consumer-facing verification step: it resolves and validates the configuration, determines the run mode, creates the run artifact directories, and exits **without starting any containers**. It also proves the CLI entry resolves and the dependency closure is complete after a single install.

**Precondition:** configuration must resolve before the dry-run branch is reached. If no valid `platform.json` is found, the runner exits with status `failure` (see [Configuration](#configuration)) — it never reaches the dry-run step. So run the check from a working directory where a valid configuration resolves (the caller's own platform config, or this repository).

As a consumer (from the caller repository root, so the caller's `platform.json` resolves):

```sh
onecx-it-runner --dry-run
```

In this repository (the `npm run it:run` wrapper):

```sh
npm run it:run -- --dry-run
```

To exercise the full contract end to end from a packed tarball, install the built package into a scratch project as its only dependency (no separate `testcontainers`, `dockerode`, or `axios` declarations), place a valid `platform.json` where the [config lookup](#configuration) resolves it, and run the dry-run entry:

```sh
npm install ./onecx-integration-tests-<version>.tgz
onecx-it-runner --dry-run
```

If the dry run exits with status `success`, the single-install contract holds: one installation, no peer declarations, a resolvable CLI entry, and a passing configuration check.

## Artifacts

Each run creates a directory under:

`integration-tests/artifacts/<run-id>/`

Typical output:

- `summary.json` – run metadata (status, duration, mode, exit code, `e2eExecutions`, `e2eAggregate`)
- `logs/runner-output.log` – runner logs (with `--capture-logs`)
- `logs/containers.log` – captured stdout/stderr and container streams (written when `--capture-logs` is enabled)
- `reports/` – generated reports
- `e2e/` – runtime metadata (for example `platform-info.json`)
- `e2e/e2e-executions.json` – ordered E2E execution records plus aggregate counters
- `e2e-results/` – E2E result files

The standalone `start-e2e` entry point and its `--config`/`CONFIG_PATH` options are no longer supported. Consumers should use `onecx-it-runner` and `platformConfig.container.e2e`.

Additional generated runtime metadata may be exported by the platform runtime to the same run artifacts directory.

## Development

Build:

```sh
npm run build
```

Test:

```sh
npm test
```

CI test command:

```sh
npm run test:ci
```

Lint:

```sh
npm run lint
```

Format:

```sh
npm run format
```

Sonar analysis:

```sh
npm run sonar
```

## E2E Playwright project

Playwright tests are located in:

`integration-tests/e2e/playwright`

See its local README for container execution and local debug commands.

## Import Data Assets

Import payloads and import logic used by the platform data importer are located under:

`src/imports`

Assumptions about container network aliases used by import payloads are documented in:

`docs/import-assumptions.adoc`

## License

Apache-2.0

## Contributors

OneCX Development Team <onecx_dev@1000kit.org>
