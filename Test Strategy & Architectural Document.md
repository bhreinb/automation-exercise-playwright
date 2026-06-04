# Test Strategy & Architectural Document

## 1) Overall Test Strategy for This Application

This repository implements a **hybrid test strategy** for the Automation Exercise application using **Playwright + TypeScript**:

- **API tests** validate backend behavior deterministically using Playwright’s request client (fast feedback, fewer UI flake vectors).
- **UI end-to-end tests** validate critical **user journeys** through the browser (real workflows, confidence in wiring, selectors, and page behavior).
- **Integration fixtures** bridge API and UI by sharing domain data and common fixtures, enabling workflows like:
  - create user via API
  - authenticate via UI
  - assert resulting UI state

The overarching goals are:

- Detect regressions early (developer feedback loop).
- Ensure high confidence on core journeys (smoke + targeted suites).
- Keep tests reliable and maintainable through consistent fixtures, page objects, and project-level Playwright configuration.

## 2) Structuring Testing Across Layers (UI, API, Integration)

### 2.1 UI Layer (Browser / End-to-End)

**Where:**

- `e2e/tests/ui/**` (test entry points)
- `e2e/src/ui/**` (page objects / UI fixtures)

**What it tests:**

- Signup flows (where applicable).
- Login with correct credentials.
- Login with incorrect credentials (negative path).
- Logout and post-logout header state.

**How it is built:**

- **Page Objects** under `e2e/src/ui/pages/**` encapsulate selectors and UI actions.
- **UI Fixtures** under `e2e/src/ui/fixtures/**` (where present) provide reusable setup.
- **Shared header/page helpers** (e.g., logout link visibility, logged-in user extraction).

**Improvement area:** Refactor the UI layer to be more “UI-driven end-to-end” (assert UI behavior as the primary source of truth) while using API mocking/seed data only as needed to reduce flakiness and speed up PR feedback.

### 2.2 API Layer (Request / Contract-like checks)

**Where:**

- `e2e/tests/api/**` (API test entry points)
- `e2e/src/api/**` (API clients/method factories + API fixtures)

**What it tests:**

- Products retrieval and response shape.
- Brands retrieval and response shape.
- Product search result expectations.
- Auth/account operations (create account, verify login, update/delete flows).

**How it is built:**

- **Endpoint clients / method factories** under `e2e/src/api/clients/**`.
- **API fixtures** provide pre-built “method bundles” for the spec files.

**Improvement area:** Expand API assertions to validate full response shape/schema (not only status/message) to improve failure signal and prevent assertion drift.

### 2.3 Integration Layer (API + UI Combined via Fixtures)

**Where:**

- `e2e/tests/ui/**` (specs that request integration fixtures)
- `e2e/src/common/fixtures/**` (shared integration fixtures)

**What it tests:**

- “Golden path” workflows that require both layers (e.g., prepare data via API, validate behavior via UI).

**How it is built:**

- **Integration fixtures** reuse the underlying API method factories and UI page objects without duplicating logic.
- Tests can request both API and UI fixtures from the same `test` extension.

**Improvement area:** Extend integration fixtures to cover practical end-to-end user flows across both UI and API (e.g., “register on UI”, “search on UI”, “login/logout on UI”, paired with matching API provisioning helpers) so scenarios stay realistic and reusable without excessive setup duplication.

## 3) Rationale for Tooling and Framework Choices

### 3.1 Playwright

- One framework for:
  - browser automation (UI)
  - request-based testing (API)
- Consistent execution model, retries, tracing, and reporting.
- **Playwright (Microsoft-backed)**: Playwright is developed and supported by **Microsoft**, which has helped drive rapid feature development and strong ecosystem support.
- **Strong open-source plugin ecosystem**: Playwright supports community plugins and integrations—this project uses **Allure** (via `allure-playwright`) for richer reporting.
- **IDE support**: major IDEs (e.g., JetBrains IDEs, VS Code) provide first-class Playwright awareness, improving developer productivity (run/debug integrations, test discovery, etc.).
- **Extensibility via fixtures**: Playwright’s fixture system enables dependency injection-style composition (as demonstrated in this repo with shared API/UI/integration fixtures).

### 3.2 TypeScript

- A large portion of modern front-end development (often React-based) is written in **JavaScript/TypeScript**, with **TypeScript being especially popular**.
- Using TypeScript in the test suite aligns the test codebase with the ecosystem used by the application UI.
- Strong typing for fixtures, page objects, and endpoint method wrappers.
- Easier refactoring and safer evolution of test abstractions.

### 3.3 Page Object Model (POM) for UI

- Centralizes selectors and UI actions.
- Reduces duplication and makes UI changes localized.

### 3.4 Fixture-Based Composition

- Fixtures provide dependency injection-like patterns.
- Enables clean separation between:
  - API “method bundles”
  - UI page object instances
  - integration composition

### 3.5 Playwright Projects

The repository uses multiple Playwright **projects** to isolate execution contexts:

- `setup`: creates/records storage state (e.g., auth cookies) and saves `.auth/user.json`
- `chromium`: runs UI specs using `storageState`
- `api`: runs API specs without browser

This improves performance and reliability by avoiding accidental cross-execution.

## 4) Integrating Testing into CI/CD Pipelines

### 4.1 Test Stages

Run tests by project for speed and parallelization:

- **UI** (chromium): `npx playwright test --project=chromium`
- **API**: `npx playwright test --project=api`

In CI/CD, you can also run both **UI** and **API** as separate stages (often in parallel), rather than a single combined run.

In addition, this repo supports a **tagging strategy**:
- `@smoke` for fast, confidence-building checks
- `@regression` for broader coverage / deeper validation

Typical CI/CD stage examples:
- **UI smoke**: `npm run test:ui -- --grep @smoke`
- **API smoke**: `npm run test:api -- --grep @smoke`
- **UI regression**: `npm run test:ui -- --grep @regression`
- **API regression**: `npm run test:api -- --grep @regression`

### 4.2 Test Strategy (CI vs Nightly)

Split execution into fast CI runs and broader regression runs:

- **CI (fast)**: run a smaller, deterministic suite (API + UI smoke subset)
- **Nightly/Regression**: run the full UI + API matrix, enabling longer runtime and deeper coverage

### 4.3 Tagging Strategy (smoke + regression)

Tests are labeled using Playwright tags (e.g., `@smoke`, `@regression`) to control selection at runtime.

**Execution patterns** (can be combined with UI/API projects):

- **Smoke runs** (fast feedback): `npx playwright test --grep @smoke`
- **Regression runs** (broader coverage): `npx playwright test --grep @regression`
- **Smoke + Regression**: `npx playwright test --grep "@smoke|@regression"`

**CI/CD mapping (example using repo scripts):**

- `npm run test.smoke` → `--grep @smoke`
- `npm run test.regression` → `--grep @regression`

For stage orchestration, you can also run dedicated **UI** and **API** stages in parallel (rather than a single combined run):

- UI stage: `npm run test:ui` (optionally add `--grep @smoke` / `--grep @regression`)
- API stage: `npm run test:api` (optionally add `--grep @smoke` / `--grep @regression`)

### 4.4 Reporting / Artifacts

Upload test artifacts for debugging and auditability:

- Playwright HTML report (`playwright-report/`)
- Allure raw results (`allure-results/`)
- Playwright outputs (`test-results/`)
- JUnit XML (`results.xml`)

### 4.5 Promotion Strategy

Run faster, lower-risk suites on PRs (API + a small UI subset), then run the full UI + API matrix on the main/nightly pipeline to catch broader regressions.

## 5) Scaling Across Multiple Teams and Services

To scale:

- Standardize fixture naming and folder structure under `e2e/src/`.
- Encourage teams to contribute:
  - endpoint wrappers to `e2e/src/api/clients/**`
  - page objects to `e2e/src/ui/pages/**`
  - shared integration fixtures to `e2e/src/common/fixtures/**`

Practical measures:

- **Code review rules**:
  - forbid “raw selectors” in specs (prefer page objects)
  - only use `expect` assertions inside **spec files** (page objects/fixtures should return data/state instead of asserting)
- **Shared utilities**:
  - centralized wait helpers and stable locators
- **Code quality automation**:
  - use **ESLint** (and a shared ESLint config from the Artifactory-published test utils package) to enforce consistent coding semantics
  - run lint in CI so violations are caught before tests merge

### Publish a shared Playwright testing package (for Artifactory consumption)

To standardize test abstractions across multiple teams, create an internal npm package (e.g., `@org/playwright-automation-exercise-test-utils`) that:

- is published to Artifactory
- is versioned and semver-compatible to support safe upgrades
- provides a **base “platform layer”** (shared Playwright configuration patterns, fixtures, utilities, and conventions)
- exposes stable imports for common fixtures, page objects, and API method wrappers
- lets teams build **on top of the base layer** (extending fixtures/page objects with team-specific modules while keeping behavior consistent)
- allows teams to consume the same building blocks (consistent behavior, reduced duplication)

## 6) Approach to Testing Microservices vs Monolithic Architectures

### 6.1 Monolithic Architecture

- UI and API tests can cover a broader set of user journeys.
- Endpoint clients may be “single-service” wrappers.
- Integration tests validate end-to-end workflows more directly via shared fixtures.

### 6.2 Microservices

- Keep the same layers (API / UI / integration), but make API “resource factories / method bundles” domain-specific (e.g., auth vs catalog) so setup and assertions clearly map to the owning service.
- Use integration fixtures to compose multiple domain factories and verify the cross-service outcome via UI (contract correctness + user-visible behavior).
- In CI, keep fast API vs broader UI/integration separation using Playwright projects and tags (`@smoke`, `@regression`).

## 7) Handling Test Data, Environments, and Reliability

### 7.1 Test Data

Current approach:

- UI tests can rely on API-created users.
- API fixtures wrap endpoints like “create account” so tests can provision their own data.

Recommended improvements:

- Provide deterministic generation helpers (e.g., unique email strategy).
- Add cleanup strategies for destructive operations (delete/update flows).

### 7.2 Environments

- Use Playwright `baseURL` to target the desired deployment environment.
- Keep environment configuration centralized in `playwright.config.ts` and environment variables.

### 7.3 Reliability & Flaky Tests

Key tactics:

- Prefer stable selectors:
  - `data-qa` attributes
  - role-based locators when possible
- Use explicit waiting strategies inside page objects:
  - `waitForLoadState`
  - `locator.waitFor({ state: 'visible' })`
- Keep negative assertions strict:
  - verify visible error state via a locator scoped to the login form

Additional tactics:

- Limit concurrency if environment instability exists.
- Use tracing on retries (already configured).
- If failures occur, ensure artifacts (screenshots/videos/trace) are uploaded.

## 8) Key Trade-offs, Assumptions, and Areas for Future Improvement

### Trade-offs / Assumptions

- UI tests are inherently slower and more fragile than API tests.
- Integration fixtures improve coverage but can increase complexity.
- Relying on storage state `.auth/user.json` assumes stable cookie/session behavior.

### Areas for Future Improvement

- **More robust multi-environment execution**:
  - standardize env variables for dev/qa/stage/prod baseURL selection
  - ensure CI can run the same suites against multiple environments (dev, qa, stage, prod)
- **Contract testing**:
  - complement API specs with schema/contract validation
- **Contract testing**:
  - complement API specs with schema/contract validation
- **Test data lifecycle**:
  - automated cleanup or sandboxed test accounts
- **Stronger typing**:
  - replace `any`-based config accesses in specs with typed helper utilities
- **UI Page Object evolution**:
  - consider multiple “page inheritance” patterns via mixins to share cross-cutting behavior (shared header/footer, common auth widgets, etc.)

---
