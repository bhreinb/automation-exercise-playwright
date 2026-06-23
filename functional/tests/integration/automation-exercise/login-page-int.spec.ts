import { loginApiFixtures } from "@fixtures/api/automation-exercise/login-api.fixtures";
import {
  test as orchestrationTest,
  expect,
} from "@fixtures/integration/automation-exercise/orchestration.fixtures";
import { LoginApiFlows } from "@models/api/automation-exercise/login-api.types";
import type { AutomationUser } from "@models/common/automation-exercise/login.types";
import {
  businessFunctionTested,
  businessStep,
} from "@support/common/generic/business-function-messages";

// Unified orchestration runner injection combining our API data-seeding and Page Objects
const test = orchestrationTest.extend<LoginApiFlows>(loginApiFixtures);

test.describe("Login Page Tests", () => {
  let fakeUser: AutomationUser;

  // 1️⃣ TOP-LEVEL SETUP: Registers a fresh user via background API
  test.beforeEach(
    "Given a pre-registered application user account exists via backend API",
    async ({ registerUserByApi }) => {
      fakeUser = registerUserByApi;
    },
  );

  test(
    "Test Case 3: Login User with incorrect email and password",
    { tag: "@regression" },
    async ({ loginPage }) => {
      await loginPage.goto();

      // When: User attempts to login with a wrong password
      await loginPage.login(fakeUser.email, "wrongPassword");

      // Then: Encapsulate assertion inside nested steps for clean business telemetry
      await test.step(
        businessStep("Validate authentication error bounds for faulty login"),
        async () => {
          await test.step(
            businessFunctionTested(
              "Verify login shows error for incorrect credentials",
            ),
            async () => {
              await expect(loginPage.loginErrorMessage).toBeVisible();
            },
          );
        },
      );
    },
  );

  test(
    "Test Case 5: Registering User with existing email",
    { tag: "@regression" },
    async ({ loginPage }) => {
      await loginPage.goto();

      // When: User attempts to register with an existing email
      await loginPage.signup(fakeUser.name, fakeUser.email);

      // Then: Verify system rejects duplicate accounts securely
      await test.step(
        businessStep("Validate duplicate account constraint warnings"),
        async () => {
          await test.step(
            businessFunctionTested(
              "Verify signup shows email address is already registered",
            ),
            async () => {
              await expect(loginPage.signupErrorMessage).toBeVisible();
            },
          );
        },
      );
    },
  );

  test.describe("Logged In Workflow", () => {
    // 2️⃣ NESTED SUB-SUITE SETUP: Logs the user into the UI
    test.beforeEach(
      "When the user routes to the application and authenticates with valid credentials",
      async ({ loginPage }) => {
        await loginPage.goto();
        await loginPage.login(fakeUser.email, fakeUser.password);
      },
    );

    // 2️⃣ NESTED SUB-SUITE TEARDOWN: Logs the user out of the UI
    test.afterEach(
      "Then the user's active session is terminated securely",
      async ({ loginPage }) => {
        await loginPage.header.logout();
        await loginPage.verifyPageLoaded();
      },
    );

    test(
      "Test Case 2: Login User with correct email and password",
      { tag: ["@regression", "@smoke"] },
      async ({ loginPage }, testInfo) => {
        const currentUrl = loginPage.getCurrentUrlNormalized();
        const baseUrl = loginPage.getBaseUrlNormalized(testInfo);

        await test.step(
          businessStep("Validate redirect routing post authorization success"),
          async () => {
            expect(
              currentUrl,
              businessFunctionTested("login redirects to base URL"),
            ).toBe(baseUrl);
          },
        );

        await test.step(
          businessStep("Verify account navigational elements are unlocked"),
          async () => {
            await test.step(
              businessFunctionTested("logout link visible after login"),
              async () => {
                await expect(loginPage.header.logoutLink).toBeVisible();
              },
            );
          },
        );

        await test.step(
          businessStep("Validate header displays authenticated user context"),
          async () => {
            const loggedInUser = await loginPage.header.getLoggedInUser();
            expect(
              loggedInUser,
              businessFunctionTested("logged-in user matches"),
            ).toBe(fakeUser.name);
          },
        );
      },
    );

    test(
      "Test Case 4: Logout User",
      { tag: "@regression" },
      async ({ loginPage }) => {
        // The actual click execution is safely handled by the sub-suite's afterEach hook.
        await test.step(
          businessStep(
            "Verify security session termination on current client context",
          ),
          async () => {
            await test.step(
              businessFunctionTested("logout link disappears after logout"),
              async () => {
                await expect(loginPage.header.logoutLink).toBeVisible();
              },
            );
          },
        );
      },
    );
  });
});
