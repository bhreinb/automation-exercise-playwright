# Test Strategy & Architectural Document

## 1) Overall Test Strategy

This repository uses a **hybrid Playwright + TypeScript strategy** for the Automation Exercise application.

The suite is intentionally split into three layers:

- **API tests** for fast, deterministic backend validation using Playwright's request client.
- **UI tests** for browser-based user journey validation.
- **Integration tests** that combine API setup with UI verification through shared fixtures.

Primary goals:

- Detect regressions early.
- Keep feedback fast for developers.
- Validate critical user flows with realistic coverage.
- Keep the suite maintainable through fixtures, page objects, and reusable endpoint factories.
- Produce readable reports through explicit business-oriented step naming.

---

## 2) Repository Structure and Test Layers

### 2.1 Current Project Structure

The active test implementation lives under `functional/`.

**Source code:**

- `functional/src/facade/**`
  - `api/http-client/**` (API client + endpoint method factories)
  - `ui/page-object/**` (UI page objects)
- `functional/src/fixtures/**`
  - API fixtures
  - UI fixtures
  - integration fixtures
- `functional/src/models/**`
  - shared fixture and payload typing
- `functional/src/support/**`
  - reporting helpers
  - teardown support

**Test entry points:**

- `functional/tests/api/**`
- `functional/tests/ui/**`
- `functional/tests/integration/**`

This is the canonical structure for the current repository and should be treated as the source of truth instead of any older `e2e/**` references.

### 2.2 API Layer

**Where:**

- `functional/tests/api/**`
- `functional/src/facade/api/http-client/**`
- `functional/src/fixtures/api/**`

**What it tests:**

- Products retrieval and response shape.
- Brands retrieval and method validation.
- Product search behavior.
- Login verification.
- Account lifecycle operations:
  - create
  - query
  - update
  - delete

**How it is built:**

- `BaseApiClient` centralizes low-level HTTP verbs.
- `EndpointMethodsFactory` exposes domain-specific method bundles.
- API fixtures inject those bundles into specs through Playwright fixtures.

**Design intent:**

- Keep specs focused on behavior and assertions.
- Keep transport details in one place.
- Reuse the same API abstractions in both API and integration tests.

### 2.3 UI Layer

**Where:**

- `functional/tests/ui/**`
- `functional/src/facade/ui/page-object/**`
- `functional/src/fixtures/ui/**`

**What it tests:**

- User-visible navigation.
- Login and signup flows.
- Authenticated header state.
- Account-created and delete-account flows.
- Logout and post-authentication behavior.

**How it is built:**

- Page objects encapsulate selectors and UI interactions.
- UI fixtures compose page objects for test consumption.
- Shared base-page behavior standardizes navigation and page-load verification.

### 2.4 Integration Layer

**Where:**

- `functional/tests/integration/**`
- `functional/src/fixtures/integration/**`
- supporting API/UI fixtures under their respective fixture folders

**What it tests:**

- Flows that benefit from API setup and UI validation together.
- Realistic user paths where backend provisioning reduces slow or flaky setup.

**How it is built:**

- API fixtures prepare state.
- UI fixtures drive the browser.
- Integration fixtures compose both without duplicating setup logic.

---

## 3) Core Architectural Patterns

### 3.1 Playwright Fixtures as Composition Root

Fixtures are the main composition mechanism in this repository.

They are used to inject:

- API method bundles
- page objects
- integration flows
- shared setup/teardown behavior

This keeps spec files lightweight and makes dependency wiring explicit.

### 3.2 Page Object Model

UI behavior is modeled through page objects.

Benefits:

- selectors stay centralized
- UI changes are localized
- business flows remain readable in specs
- navigation and page verification can be standardized in shared base classes

### 3.3 Endpoint Method Factory Pattern

API calls are grouped through `EndpointMethodsFactory`, which extends `BaseApiClient`.

This gives the test suite:

- a single place for HTTP verb behavior
- resource-oriented method grouping
- reuse across API and integration tests
- clearer intent than scattering raw `request.get/post/...` calls through specs

### 3.4 Strong Typing Through TypeScript

TypeScript is used to strongly type:

- fixtures
- API payloads
- method bundles
- shared models
- test helper contracts

This improves refactor safety and keeps test abstractions easier to evolve.

---

## 4) Reporting and Step Semantics

Readable reporting is treated as part of the architecture, not just an output concern.

### 4.1 Business-Facing Step Naming

The repository already uses reporting helpers from:

- `functional/src/support/common/generic/business-function-messages.ts`

Current conventions:

- `businessStep(message)`
  - produces: `Business Step: ...`
- `businessFunctionTested(message, context?)`
  - produces: `Business Action: ...`
  - optionally appends technical details

### 4.2 Intended Usage

These helpers should be preferred when a step is meant to be understandable by:

- QA
  n- engineers
- stakeholders reviewing Allure timelines

Examples:

- `Business Step: Navigate to the 'Login' application view`
- `Business Step: Verify 'Signup' view structure has settled successfully`
- `Business Action: Confirm destruction state and proceed to homepage`

### 4.3 Reporting Goal

Low-level technical actions should be wrapped or surfaced in a way that keeps Allure timelines readable and business-oriented where practical.

This is especially useful for:

- navigation
- page verification
- business workflow validation
- API actions that matter to the scenario narrative

---

## 5) Playwright Configuration Strategy

The Playwright configuration is defined in `playwright.config.ts`.

### 5.1 Active Projects

The suite currently uses these projects:

- `setup`
- `ui`
- `integration`
- `api`

### 5.2 Project Intent

- **setup**
  - creates reusable auth/storage state where needed
- **ui**
  - runs browser-driven UI specs
- **integration**
  - runs combined API + UI scenarios
- **api**
  - runs request-based API specs without a browser dependency

### 5.3 Shared Runtime Settings

The current config also standardizes:

- `baseURL`
- tracing on retry
- screenshots on failure
- retained video on failure
- global teardown
- reporter configuration

---

## 6) CI/CD Strategy

### 6.1 Repository Scripts

The repository currently exposes these relevant scripts:

- `npm run test:api`
- `npm run test:ui`
- `npm run test:integration`
- `npm run test:smoke`
- `npm run test:regression`
- `npm run test:ci`

### 6.2 Recommended Pipeline Split

**Fast PR pipeline:**

- API tests
- smoke-tagged UI/integration coverage

**Broader validation pipeline:**

- full API project
- full UI project
- full integration project

### 6.3 Tagging Strategy

Tests use tags such as:

- `@smoke`
- `@regression`

Recommended examples:

- `npm run test:smoke`
- `npm run test:regression`
- `npx playwright test --project=api --grep @smoke`
- `npx playwright test --project=integration --grep @regression`

### 6.4 Artifacts

CI should retain:

- `playwright-report/`
- `allure-results/`
- `test-results/`
- `results.xml`

These artifacts support debugging, trend analysis, and auditability.

---

## 7) Reliability Strategy

### 7.1 Selector Strategy

Prefer stable selectors, especially:

- `data-qa`
- role-based locators where suitable

### 7.2 Page Synchronization

Synchronization should live in page objects and shared base abstractions rather than specs whenever possible.

Examples:

- `waitForURL`
- `waitForLoadState`
- locator visibility/state waits
- shared `verifyPageLoaded()` behavior

### 7.3 Test Data Strategy

Current approach already favors self-contained setup through API fixtures.

Recommended ongoing practices:

- generate unique test data deterministically
- keep destructive flows isolated
- clean up temporary accounts where practical
- avoid cross-test state coupling

### 7.4 Failure Diagnostics

The suite is configured to preserve enough failure context through:

- tracing
- screenshots
- retained failure video
- Allure reporting
- Playwright HTML reporting

---

## 8) Scaling Guidance

To scale this framework across teams or domains:

- keep endpoint wrappers grouped by domain
- keep fixtures small and composable
- keep page objects focused on behavior, not assertions-heavy logic
- standardize business-readable report steps
- preserve strong typing for shared contracts

Recommended review rules:

- avoid raw selectors in spec files where a page object exists
- keep low-level transport logic out of specs
- prefer reusable helper abstractions over repeated inline waits
- keep assertions close to scenario intent

---

## 9) Current Gaps and Improvement Opportunities

- Improve API contract depth beyond status/message checks where useful.
- Continue aligning low-level report entries with business-readable Allure steps.
- Expand integration coverage for realistic end-to-end workflows.
- Strengthen environment parameterization for broader CI reuse.
- Keep outdated path references out of documentation as the repo evolves.

---

## 10) Summary

This repository is structured around a clear testing architecture:

- **API for speed**
- **UI for user confidence**
- **Integration for realistic workflow coverage**

The framework relies on:

- Playwright projects
- fixture composition
- page objects
- endpoint method factories
- business-readable reporting helpers

That combination provides a solid base for maintainable, scalable, and understandable automated testing.
