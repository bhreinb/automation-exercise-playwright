import {
  expect,
  test as apiTest,
} from "@fixtures/api/automation-exercise/api.fixture";
import { loginApiFixtures } from "@fixtures/api/automation-exercise/login-api.fixtures";
import { LoginApiFlows } from "@models/api/automation-exercise/login-api.types";
import { attachments } from "@support/common/generic/attachments";
import { businessStep } from "@support/common/generic/business-function-messages";

const test = apiTest.extend<LoginApiFlows>(loginApiFixtures);

test.describe("Update Account Resources Tests", () => {
  test("API 13: PUT METHOD To Update User Account", async ({
    registerUserByApi,
    account,
  }, testInfo) => {
    // Given...
    registerUserByApi.country = "Australia";
    registerUserByApi.city = "Melbourne";
    registerUserByApi.state = "Victoria";

    attachments.attachApiRequest(
      testInfo,
      "PUT",
      "/api/updateAccount",
      registerUserByApi,
    );

    // When...
    const updateAccountResponse =
      await account.putToUpdateAccount(registerUserByApi);

    // Then...
    const response = await updateAccountResponse.json();
    attachments.attachApiResponse(
      testInfo,
      "PUT",
      "/api/updateAccount",
      response,
    );

    expect(
      response.responseCode,
      businessStep("update account returns HTTP 200."),
    ).toEqual(200);
    expect(
      response.message,
      businessStep("update account returns success message."),
    ).toEqual("User updated!");
  });
});
