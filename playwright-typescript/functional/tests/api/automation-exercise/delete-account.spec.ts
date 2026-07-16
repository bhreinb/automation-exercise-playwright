import {
  test as apiTest,
  expect,
} from "@fixtures/api/automation-exercise/api.fixture";
import { loginApiFixtures } from "@fixtures/api/automation-exercise/login-api.fixtures";
import { LoginApiFlows } from "@models/api/automation-exercise/login-api.types";
import { attachments } from "@support/common/generic/attachments";
import { businessStep } from "@support/common/generic/business-function-messages";

const test = apiTest.extend<LoginApiFlows>(loginApiFixtures);

test.describe("Delete Account Resources Tests", () => {
  test("API 12: DELETE METHOD To Delete User Account", async ({
    registerUserByApi,
    deleteAccountMethods,
  }, testInfo) => {
    const request = {
      email: registerUserByApi.email,
      password: registerUserByApi.password,
    };

    attachments.attachApiRequest(
      testInfo,
      "DELETE",
      "/api/deleteAccount",
      request,
    );

    // Given & When...
    const deleteAccountResponse =
      await deleteAccountMethods.deleteAccount(request);

    // Then...
    const response = await deleteAccountResponse.json();
    attachments.attachApiResponse(
      testInfo,
      "DELETE",
      "/api/deleteAccount",
      response,
    );

    expect(
      response.responseCode,
      businessStep("delete account returns HTTP 200."),
    ).toEqual(200);
    expect(
      response.message,
      businessStep("delete account returns success message."),
    ).toEqual("Account deleted!");
  });
});
