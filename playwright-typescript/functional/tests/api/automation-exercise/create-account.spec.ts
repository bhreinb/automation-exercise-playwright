import { test, expect } from "@fixtures/api/automation-exercise/api.fixture";
import { AutomationUser } from "@models/common/automation-exercise/login.types";
import { LoginSignupData } from "@payloads/common/automation-exercise/login-signup-data";
import { attachments } from "@support/common/generic/attachments";
import { businessStep } from "@support/common/generic/business-function-messages";

test.describe("Create Account Resources Tests", () => {
  test("API 11: POST To Create/Register User Account", async ({
    createAccountMethods,
  }, testInfo) => {
    // Given...
    const fakeUser: AutomationUser = LoginSignupData.createFullFakeUser();

    attachments.attachApiRequest(
      testInfo,
      "POST",
      "/api/createAccount",
      fakeUser,
    );

    // When...
    const createAccountsResponse =
      await createAccountMethods.postToCreateAccount(fakeUser);

    // Then...
    const response = await createAccountsResponse.json();
    attachments.attachApiResponse(
      testInfo,
      "POST",
      "/api/createAccount",
      response,
    );

    expect(
      response.responseCode,
      businessStep("create user account returns HTTP 201."),
    ).toEqual(201);
    expect(
      response.message,
      businessStep("create account returns success message."),
    ).toEqual("User created!");
  });
});
