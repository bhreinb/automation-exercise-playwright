import { AccountCreatedPage } from "@facade/page-object/automation-exercise/account-created.page";
import { DeleteAccountPage } from "@facade/page-object/automation-exercise/delete-account.page";
import { LoginPage } from "@facade/page-object/automation-exercise/login.page";
import { SignupPage } from "@facade/page-object/automation-exercise/signup.page";

export type Pages = {
  loginPage: LoginPage;
  signupPage: SignupPage;
  accountCreatedPage: AccountCreatedPage;
  deleteAccountPage: DeleteAccountPage;
};
