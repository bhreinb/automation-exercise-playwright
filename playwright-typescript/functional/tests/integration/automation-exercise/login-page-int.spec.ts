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

const test = orchestrationTest.extend<LoginApiFlows>(loginApiFixtures);

test.describe("Login Page Tests", () => {
  let fakeUser: AutomationUser;

  test.beforeEach(
    "Register a user via backend API",
    async ({ registerUserByApi }) => {
      fakeUser = registerUserByApi;
    },
  );

  test(
    "Test Case 3: Login User with incorrect credentials",
    { tag: "@regression" },
    async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.login(fakeUser.email, "wrongPassword");

      await test.step(
        businessStep("Verify login error message is visible"),
        async () => {
          await expect(
            loginPage.loginErrorMessage,
            businessFunctionTested(
              "Login page should display an error message for incorrect credentials",
            ),
          ).toBeVisible();
        },
      );
    },
  );

  test(
    "Test Case 5: Registering User with existing email",
    { tag: "@regression" },
    async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.signup(fakeUser.name, fakeUser.email);

      await test.step(
        businessStep("Verify duplicate email error message"),
        async () => {
          await expect(
            loginPage.signupErrorMessage,
            businessFunctionTested(
              "Signup page should display an error message when the email is already registered",
            ),
          ).toBeVisible();
        },
      );
    },
  );

  test.describe("Logged In Workflow", () => {
    test.beforeEach("Log in with valid credentials", async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.login(fakeUser.email, fakeUser.password);
    });

    test.afterEach(
      "Terminate the active user session",
      async ({ loginPage }) => {
        await loginPage.header.logout();
        await loginPage.verifyPageLoaded();
      },
    );

    test(
      "Test Case 2: Login User with correct credentials",
      { tag: ["@regression", "@smoke"] },
      async ({ loginPage }, testInfo) => {
        const currentUrl = loginPage.getCurrentUrlNormalized();
        const baseUrl = loginPage.getBaseUrlNormalized(testInfo);

        await test.step(
          businessStep("Verify successful user login redirect"),
          async () => {
            expect(
              currentUrl,
              businessFunctionTested(
                "User should be redirected to the base URL after logging in",
              ),
            ).toBe(baseUrl);
          },
        );

        await test.step(
          businessStep("Verify logout link is visible"),
          async () => {
            await expect(
              loginPage.header.logoutLink,
              businessFunctionTested(
                "The logout link should appear in the navigation bar",
              ),
            ).toBeVisible();
          },
        );

        await test.step(
          businessStep("Verify logged-in username in header"),
          async () => {
            const loggedInUser = await loginPage.header.getLoggedInUser();
            expect(
              loggedInUser,
              businessFunctionTested(
                "The header should display the correct user name",
              ),
            ).toBe(fakeUser.name);
          },
        );
      },
    );

    test(
      "Test Case 4: Logout User",
      { tag: "@regression" },
      async ({ loginPage }) => {
        // The actual click execution is handled by the sub-suite's afterEach hook.
        await test.step(
          businessStep("Verify active session logout visibility"),
          async () => {
            await expect(
              loginPage.header.logoutLink,
              businessFunctionTested(
                "The logout link should remain visible prior to session termination",
              ),
            ).toBeVisible();
          },
        );
      },
    );
  });
});
