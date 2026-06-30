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
        businessStep("Verify successful user registration"),
        async () => {
          expect(
            accountCreatedPage.getCurrentUrlNormalized(),
            businessFunctionTested(
              "User should be on the home page after registration",
            ),
          ).toBeNormalizedBaseUrl(testInfo);
        },
      );

      await test.step(
        businessStep("Verify logged-in username in header"),
        async () => {
          const loggedInUser = await accountCreatedPage.header.getLoggedInUser();
          expect(
            loggedInUser,
            businessFunctionTested(
              "The header should display the correct user name",
            ),
          ).toBe(registerUserByUi.name);
        },
      );
    },
  );
});
