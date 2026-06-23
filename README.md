# Automation Exercise Playwright

End-to-end, integration, and API automation framework for [Automation Exercise](https://automationexercise.com/) using [Playwright](https://playwright.dev/) and TypeScript.

## Prerequisites

- **Node.js** 18 or newer is recommended
- **npm** (comes with Node.js)
- A supported browser installation for Playwright (Chromium is used for UI and integration tests)
- If you want to generate Allure reports, make sure Java is available on your machine

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

Install the Playwright browser binaries if needed:

```bash
npx playwright install
```

If you only want the Chromium browser used by the UI and integration tests:

```bash
npx playwright install chromium
```

## Project structure

The repository groups **reusable automation code** under `functional/src` and **Playwright test entry points** under `functional/tests`.

```text
functional/
  src/
    expectations/   (custom expect helpers)
    facade/
      http-client/  (API client base + endpoint factories)
      page-object/  (page objects)
      components/   (reusable UI components)
    fixtures/
      api/          (API fixtures)
      ui/           (UI fixtures)
      integration/  (integration/orchestration fixtures)
    models/         (shared types)
    payloads/       (test data builders / payloads)
    support/        (reporting helpers, teardown, utilities)
  tests/
    api/            (API spec files)
    ui/             (UI spec files)
    integration/    (integration spec files)
playwright.config.ts
package.json
README.md
Test Strategy & Architectural Document.md
```

## Test types

- `functional/tests/ui` - UI end-to-end journeys running in the `ui` Playwright project
  - login
  - signup
  - logout
  - authenticated header/navigation checks
- `functional/tests/api` - API tests using Playwright's request client in the `api` project
  - products
  - brands
  - search product
  - verify login
  - create/update/delete/query account flows
- `functional/tests/integration` - combined API + UI flows running in the `integration` project
  - cross-layer workflows using shared fixtures
- setup coverage is handled by the dedicated `setup` Playwright project

## Configuration

Main Playwright configuration lives in:

- `playwright.config.ts`

It defines:

- test directory: `./functional/tests`
- projects: `setup`, `ui`, `integration`, `api`
- base URL: `https://automationexercise.com`
- retries, traces, screenshots, videos, and reporters
- Allure reporting via `allure-playwright`

## Running tests

### Run all tests (CI)

> Note: this script sets `CI=true`

```bash
npm run test:ci
```

### Run smoke tests

```bash
npm run test:smoke
```

### Run regression tests

```bash
npm run test:regression
```

### Run API tests only

```bash
npm run test:api
```

### Run UI tests only

```bash
npm run test:ui
```

### Run integration tests only

```bash
npm run test:integration
```

### Run headed browser tests

```bash
npm run test:headed
```

## Available npm scripts

| Script                      | Description                                                  |
| --------------------------- | ------------------------------------------------------------ |
| `npm run format`            | Format the project with Prettier                             |
| `npm run lint`              | Run ESLint                                                   |
| `npm run lint:fix`          | Run ESLint with automatic fixes                              |
| `npm run test:ci`           | Run all Playwright tests in CI mode                          |
| `npm run test:smoke`        | Run tests tagged with `@smoke`                               |
| `npm run test:regression`   | Run tests tagged with `@regression`                          |
| `npm run test:api`          | Run API tests only                                           |
| `npm run test:ui`           | Run UI tests only                                            |
| `npm run test:integration`  | Run integration tests only                                   |
| `npm run test:headed`       | Run headed browser tests for UI and integration projects     |
| `npm run report:playwright` | Open the Playwright HTML report                              |
| `npm run allure:generate`   | Generate an Allure report from `allure-results`              |
| `npm run allure:open`       | Open the generated Allure report                             |
| `npm run allure:serve`      | Generate and serve the Allure report                         |
| `npm run clean`             | Remove generated reports and test artifacts                  |

## Reporting

Generated output is written to these locations:

- `playwright-report/` - Playwright HTML report
- `allure-results/` - Allure raw results
- `allure-report/` - Generated Allure HTML report
- `test-results/` - Playwright test artifacts such as screenshots/videos/traces
- `results.xml` - JUnit XML report

### Business step reporting

The framework uses reporting helpers so higher-level actions are easier to read in Playwright and Allure reports.

Examples:

- UI actions use `businessStep(...)`
- structural/detail wrappers may use `businessFunctionTested(...)`
- API request methods are wrapped so request steps appear as:
  - `Business Step: GET "/api/brandsList"`
  - `Business Step: POST "/api/verifyLogin"`

## Authentication setup

UI and integration tests use a setup project to prepare browser state before dependent projects run.

Storage state is saved to:

- `.auth/user.json`

The setup/injected state is referenced from the `ui` and `integration` Playwright projects in `playwright.config.ts`.

## Troubleshooting

### Playwright browsers are missing

If tests fail because the browser is not installed, run:

```bash
npx playwright install
```

### Chromium is not launching

Make sure Playwright can find the installed browser binaries and that your environment supports GUI/browser execution.

### Setup state file is missing

If UI or integration tests fail because `.auth/user.json` is missing, run the setup project first:

```bash
npx playwright test --project=setup
```

### Allure commands fail

If `allure:generate` or `allure:serve` fails, verify that:

- dependencies are installed
- `allure-commandline` is available
- Java is installed and on your PATH

### Tests run against the wrong site

Check `baseURL` in `playwright.config.ts`.

## Useful links

- [Playwright Docs](https://playwright.dev/)
- [Automation Exercise](https://automationexercise.com/)
