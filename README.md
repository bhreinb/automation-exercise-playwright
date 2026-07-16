# Automation Exercise Playwright

End-to-end, integration, and API automation framework for [Automation Exercise](https://automationexercise.com/) using [Playwright](https://playwright.dev/).

This repository is split into two sub-projects:

- `playwright-typescript/` — the current Playwright + TypeScript implementation
- `playwright-java/` — placeholder scaffold for a future Playwright Java implementation

## Prerequisites

- **Node.js 18+**
- **npm**
- A supported browser installation for Playwright (Chromium is used for UI + integration tests)
- **Gradle** (only if you want to run the Java scaffold tests)

## Installation

From the repository root:

```bash
npm install
```

This installs the TypeScript/Playwright dependencies in `playwright-typescript/`.

Install the Playwright browsers if needed:

```bash
npx --prefix playwright-typescript playwright install
npx --prefix playwright-typescript playwright install chromium
```

## Project structure

```text
playwright-typescript/
  functional/
    src/    (reusable automation code)
    tests/  (Playwright test entry points)
  playwright.config.ts
  package.json
  tsconfig.json

playwright-java/
  build.gradle
  settings.gradle
  src/    (placeholder scaffold)

README.md
Test Strategy & Architectural Document.md
```

## Test types (TypeScript project)

- `playwright-typescript/functional/tests/ui` - UI journeys in the `ui` Playwright project
- `playwright-typescript/functional/tests/api` - API tests using Playwright request client in the `api` project
- `playwright-typescript/functional/tests/integration` - API + UI flows in the `integration` project
- setup coverage is handled by the dedicated `setup` project

## Configuration (TypeScript project)

Main Playwright configuration lives in:

- `playwright-typescript/playwright.config.ts`

It defines:

- test directory: `./functional/tests`
- projects: `setup`, `ui`, `integration`, `api`
- base URL: `https://automationexercise.com`
- retries, traces, screenshots, videos, and reporters
- Allure reporting via `allure-playwright`

## Running tests

### TypeScript (Playwright)

> These scripts run Playwright from inside `playwright-typescript/`.

Run all tests (CI):

```bash
npm run test:ts:ci
```

Run smoke tests:

```bash
npm run test:ts:smoke
```

Run regression tests:

```bash
npm run test:ts:regression
```

Run API / UI / integration only:

```bash
npm run test:ts:api
npm run test:ts:ui
npm run test:ts:integration
```

Run headed browser tests:

```bash
npm run test:ts:headed
```

### Java (scaffold)

Run the placeholder Java test:

```bash
npm run java:test
```

Or run directly inside `playwright-java/`:

```bash
gradle test
```

## Available npm scripts (root)

| Script | Description |
|---|---|
| `npm run test:ts:ci` | Run all TS Playwright tests in CI mode |
| `npm run test:ts:smoke` | Run TS tests tagged with `@smoke` |
| `npm run test:ts:regression` | Run TS tests tagged with `@regression` |
| `npm run test:ts:api` | Run TS API tests only |
| `npm run test:ts:ui` | Run TS UI tests only |
| `npm run test:ts:integration` | Run TS integration tests only |
| `npm run test:ts:headed` | Run headed TS tests |
| `npm run test:java` | Run Gradle tests under `playwright-java/` |
| `npm run lint:ts` | Run ESLint in `playwright-typescript/` |

## Reporting (TypeScript project)

Generated output is written relative to `playwright-typescript/` when running the TS scripts.

- `playwright-typescript/playwright-report/` - Playwright HTML report
- `playwright-typescript/allure-results/` - Allure raw results
- `playwright-typescript/allure-report/` - Generated Allure HTML report
- `playwright-typescript/test-results/` - Playwright artifacts such as screenshots/videos/traces
- `playwright-typescript/results.xml` - JUnit XML report

## Authentication setup (TypeScript project)

UI and integration tests use a setup project to prepare browser state.

Storage state is saved to:

- `playwright-typescript/.auth/user.json`

The setup/injected state is referenced from:

- `playwright-typescript/playwright.config.ts`

If needed, run setup locally:

```bash
npx --prefix playwright-typescript playwright test --project=setup
```

## Troubleshooting

### Playwright browsers are missing

```bash
npx --prefix playwright-typescript playwright install
```

### Chromium is not launching

Make sure Playwright can find the installed browser binaries and your environment supports GUI/browser execution.

### Allure commands fail

Verify that:

- dependencies are installed
- `allure-commandline` is available
- Java is installed and on your PATH

### Tests run against the wrong site

Check `baseURL` in `playwright-typescript/playwright.config.ts`.

## Useful links

- [Playwright Docs](https://playwright.dev/)
- [Automation Exercise](https://automationexercise.com/)
