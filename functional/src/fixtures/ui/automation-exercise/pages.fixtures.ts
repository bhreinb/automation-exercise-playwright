import { AccountCreatedPage } from "@facade/ui/page-object/automation-exercise/account-created.page";
import { DeleteAccountPage } from "@facade/ui/page-object/automation-exercise/delete-account.page";
import { LoginPage } from "@facade/ui/page-object/automation-exercise/login.page";
import { SignupPage } from "@facade/ui/page-object/automation-exercise/signup.page";
import {
  test as adBlockerTest,
  expect,
} from "@fixtures/ui/generic/ad-blocker.fixtures";
import type { Pages } from "@models/ui/automation-exercise/pages.types";
import type { Fixtures, Page } from "@playwright/test";

export const uiPagesFixtures: Fixtures = {
  loginPage: [
    async (
      { page }: { page: Page },
      use: (pageObject: Pages["loginPage"]) => Promise<void>,
    ) => {
      const loginPage: Pages["loginPage"] = new LoginPage(page);
      await use(loginPage);
    },
    { box: "self" },
  ],

  signupPage: [
    async (
      { page }: { page: Page },
      use: (pageObject: Pages["signupPage"]) => Promise<void>,
    ) => {
      const signupPage: Pages["signupPage"] = new SignupPage(page);
      await use(signupPage);
    },
    { box: "self" },
  ],

  accountCreatedPage: [
    async (
      { page }: { page: Page },
      use: (pageObject: Pages["accountCreatedPage"]) => Promise<void>,
    ) => {
      const accountCreatedPage: Pages["accountCreatedPage"] =
        new AccountCreatedPage(page);
      await use(accountCreatedPage);
    },
    { box: "self" },
  ],

  deleteAccountPage: [
    async (
      { page }: { page: Page },
      use: (pageObject: Pages["deleteAccountPage"]) => Promise<void>,
    ) => {
      const deleteAccountPage: Pages["deleteAccountPage"] =
        new DeleteAccountPage(page);
      await use(deleteAccountPage);
    },
    { box: "self" },
  ],
};

// Keep page-object wrapper fixtures out of the report.
//
// The test should only show business-relevant steps/fixtures, not every
// dependency fixture used to construct page-object helpers.
export const test = adBlockerTest.extend<Pages>(uiPagesFixtures);

export { expect };
