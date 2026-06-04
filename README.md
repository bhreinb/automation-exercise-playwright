# Automation Exercise Playwright

End-to-end and API automation framework for [Automation Exercise](https://automationexercise.com/) using [Playwright](https://playwright.dev/) and TypeScript.

## Prerequisites

- **Node.js** 18 or newer is recommended
- **npm** (comes with Node.js)
- A supported browser installation for Playwright (Chromium is used for UI tests)
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

If you only want the Chromium browser used by the UI tests:

```bash
npx playwright install chromium
```

## Project structure

The repository groups **reusable automation code** under `e2e/src` and **Playwright test entry points** under `e2e/tests`.

```text
e2e/
  src/
    api/      (request clients + API fixtures)
    ui/       (page objects + UI fixtures)
    common/   (shared models/data + integration fixtures)
  tests/
    api/      (API spec files)
    ui/       (UI spec files + setup)
playwright.config.ts
package.json
```

### Test types

- `e2e/tests/ui` - UI end-to-end journeys running in the Chromium Playwright project
  - **User signup**: create an account via the UI (email/password + profile fields)
  - **Login**: login with correct credentials
  - **Negative login**: verify the error message on invalid email/password
  - **Logout**: verify the header/header state after logging out
- `e2e/tests/api` - API tests using Playwright's request client
  - **Products**: fetch products list and validate response structure
  - **Brands**: fetch brands and validate response structure
  - **Search**: search products and validate results
  - **Auth & account**: create account, verify login, and manage account data
- `e2e/tests/ui/**/*.setup.ts` - setup tests (e.g. saves `.auth/user.json` for logged-in state)

## Configuration

Main Playwright configuration lives in:

- `playwright.config.ts`

It defines:

- the test directory
- the browser project for UI tests
- the setup project
- the API project
- base URL: `https://automationexercise.com`
- report output options

## Running tests

### Run all tests (API + UI) (CI)

> Note: this script sets `process.env.CI=true`

```bash
npm run test.ci
```

### Run tests in headed mode (UI)

```bash
npm run test:headed
```

### Run UI tests only (Chromium)

```bash
npm run test:ui
```

### Run API tests only

```bash
npm run test:api
```

## Available npm scripts

| Script                      | Description                                     |
| --------------------------- | ----------------------------------------------- |
| `npm run format`            | Format the project with Prettier                |
| `npm run test.ci`           | Run all Playwright tests (API + UI) in CI (sets `process.env.CI=true`) |
| `npm run test:ui`           | Run UI tests only (Chromium)                    |
| `npm run test:api`          | Run API tests only                              |
| `npm run test:headed`       | Run Playwright tests in headed mode             |
| `npm run report:playwright` | Open the Playwright HTML report                 |
| `npm run allure:generate`   | Generate an Allure report from `allure-results` |
| `npm run allure:open`       | Open the generated Allure report                |
| `npm run allure:serve`      | Generate and serve the Allure report            |
| `npm run clean`             | Remove generated reports and test artifacts     |

## Reports and artifacts

Generated output is written to these locations:

- `playwright-report/` - Playwright HTML report
- `allure-results/` - Allure raw results
- `allure-report/` - Generated Allure HTML report
- `test-results/` - Playwright test artifacts such as screenshots/videos
- `results.xml` - JUnit XML report

## Authentication setup

UI tests use a setup step to save storage state before running Chromium tests.

The setup file is located at:

- `e2e/tests/ui/automation-exercise/auth.setup.ts`

It loads the site, accepts cookies if shown, and stores auth state in:

- `.auth/user.json`

## Troubleshooting

### Playwright browsers are missing

If tests fail because the browser is not installed, run:

```bash
npx playwright install
```

### Chromium is not launching

Make sure Playwright can find the installed browser binaries and that your environment supports GUI/browser execution.

### Setup state file is missing

If Chromium tests fail because `.auth/user.json` is missing, run the setup project first:

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
