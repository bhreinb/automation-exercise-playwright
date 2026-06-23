// functional/src/tests/automation-exercise/register-user.spec.ts
import { loginUiFixtures } from "@fixtures/ui/automation-exercise/login-ui.fixtures";
import {
  test as uiTest,
  expect,
} from "@fixtures/ui/automation-exercise/pages.fixtures";
import { LoginUiFlows } from "@models/ui/automation-exercise/login-ui.types";
import {
  businessFunctionTested,
  businessStep,
} from "@support/common/generic/business-function-messages";

// Unified UI injection runner combining our frontend Page Objects and workflow hooks
const test = uiTest.extend<LoginUiFlows>(loginUiFixtures);

test.describe("Login Page Tests", () => {
  test(
    "Test Case 1: Register User",
    { tag: "@regression" },
    async ({ registerUserByUi, accountCreatedPage }, testInfo) => {
      // Note: The heavy browser form steps are already executed invisibly inside the 'registerUserByUi' hook fixture!

      // Then: Validate post-registration application state boundaries
      await test.step(
        businessStep(
          "Validate redirect routing post profile registration success",
        ),
        async () => {
          expect(
            accountCreatedPage.getCurrentUrlNormalized(),
            businessFunctionTested("register user redirects to base URL"),
          ).toBeNormalizedBaseUrl(testInfo);
        },
      );

      await test.step(
        businessStep(
          "Validate header displays the newly registered user context",
        ),
        async () => {
          const loggedInUser =
            await accountCreatedPage.header.getLoggedInUser();
          expect(
            loggedInUser,
            businessFunctionTested("logged-in user matches created user"),
          ).toBe(registerUserByUi.name);
        },
      );
    },
  );
});
