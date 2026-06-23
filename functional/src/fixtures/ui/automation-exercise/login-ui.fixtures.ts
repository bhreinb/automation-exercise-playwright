import { AccountCreatedPage } from "@facade/ui/page-object/automation-exercise/account-created.page";
import { DeleteAccountPage } from "@facade/ui/page-object/automation-exercise/delete-account.page";
import { LoginPage } from "@facade/ui/page-object/automation-exercise/login.page";
import { SignupPage } from "@facade/ui/page-object/automation-exercise/signup.page";
import type { AutomationUser } from "@models/common/automation-exercise/login.types";
import type { LoginUiFlows } from "@models/ui/automation-exercise/login-ui.types";
import type { Pages } from "@models/ui/automation-exercise/pages.types";
import { LoginSignupData } from "@payloads/common/automation-exercise/login-signup-data";
import type { Page, TestFixture } from "@playwright/test";

import { test as base } from "./pages.fixtures";

export const loginUiFixtures: {
  [K in keyof LoginUiFlows]: TestFixture<LoginUiFlows[K], { page: Page }>;
} = {
  registerUserByUi: async (
    { page }: { page: Page },
    use: (user: AutomationUser) => Promise<void>,
  ) => {
    const user: AutomationUser = LoginSignupData.createFullFakeUser();

    const loginPage: Pages["loginPage"] = new LoginPage(page);
    const signupPage: Pages["signupPage"] = new SignupPage(page);
    const accountCreatedPage: Pages["accountCreatedPage"] =
      new AccountCreatedPage(page);
    const deleteAccountPage: Pages["deleteAccountPage"] = new DeleteAccountPage(
      page,
    );

    // Setup: boxed so Allure attributes the registration workflow to this fixture.
    await base.step(
      `Fixture: registerUserByUi (setup) [${user.email}]`,
      async () => {
        await loginPage.goto();
        await loginPage.signup(user.name, user.email);

        await signupPage.verifyPageLoaded();
        await signupPage.fillAccountInformation(user);
        await signupPage.fillAddressInformation(user);
        await signupPage.submitRegistrationForm();

        await accountCreatedPage.verifyPageLoaded();
        await accountCreatedPage.proceedToHomepage();
      },
      { box: true },
    );

    await use(user);

    // Teardown: boxed; runs after the test completes.
    await base.step(
      "Fixture: registerUserByUi (teardown) - Clean up registered account via UI layout links",
      async () => {
        await accountCreatedPage.header.deleteLink.click();
        await deleteAccountPage.verifyPageLoaded();
        await deleteAccountPage.proceedToHomepage();
      },
      { box: true },
    );
  },
};
