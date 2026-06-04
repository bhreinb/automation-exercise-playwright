import { test as base } from "@playwright/test";
import { LoginPage } from "../../pages/automation-exercise/login.page";
import { SignupPage } from "../../pages/automation-exercise/signup.page";
import { AccountCreatedPage } from "../../pages/automation-exercise/account-created.page";

type Pages = {
  loginPage: LoginPage;
  signupPage: SignupPage;
  accountCreatedPage: AccountCreatedPage;
};

export const uiPagesFixtures: Pages = {
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },

  accountCreatedPage: async ({ page }, use) => {
    await use(new AccountCreatedPage(page));
  },
};

export const test = base.extend<Pages>(uiPagesFixtures);

export const expect = test.expect;
