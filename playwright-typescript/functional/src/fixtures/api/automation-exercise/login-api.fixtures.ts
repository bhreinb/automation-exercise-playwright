import { ApiFixtures } from "@models/api/automation-exercise/api.types";
import type { LoginApiFlows } from "@models/api/automation-exercise/login-api.types";
import type { AutomationUser } from "@models/common/automation-exercise/login.types";
import { LoginSignupData } from "@payloads/common/automation-exercise/login-signup-data";
import type { TestFixture, TestInfo } from "@playwright/test";
import { attachments } from "@support/common/generic/attachments";

import { test as base } from "./api.fixture";

// Single, self-contained export payload with an inline mapped type contract
export const loginApiFixtures: {
  [K in keyof LoginApiFlows]: TestFixture<
    LoginApiFlows[K],
    Pick<ApiFixtures, "createAccountMethods" | "deleteAccountMethods">
  >;
} = {
  registerUserByApi: async (
    { createAccountMethods, deleteAccountMethods },
    use,
    testInfo: TestInfo,
  ) => {
    const user: AutomationUser = LoginSignupData.createFullFakeUser();

    await base.step(
      `Pre-condition: Seed temporary user account (${user.email})`,
      async () => {
        const createAccountsResponse =
          await createAccountMethods.postToCreateAccount(user);
        const response = await createAccountsResponse.json();
        if (
          response.responseCode !== 201 ||
          response.message !== "User created!"
        ) {
          throw new Error(
            `Setup Failure: [${response.responseCode}] ${response.message}`,
          );
        }
      },
    );

    // Attach generated user only after successful fixture setup
    attachments.attachJsonIfNotEmpty(testInfo, "test-user", user);

    await use(user);

    await base.step(
      "Post-condition: Clean up seeded user account via API",
      async () => {
        const deleteAccountResponse = await deleteAccountMethods.deleteAccount({
          email: user.email,
          password: user.password,
        });
        const response = await deleteAccountResponse.json();
        const isSuccessful =
          response.responseCode === 200 &&
          response.message === "Account deleted!";
        const isAlreadyDeletedByTest =
          response.responseCode === 404 ||
          response.message?.toLowerCase().includes("not found");
        if (!isSuccessful && !isAlreadyDeletedByTest) {
          throw new Error(
            `Teardown Failure: [${response.responseCode}] ${response.message}`,
          );
        }
      },
    );
  },
};
