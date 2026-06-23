import {
  expect,
  test as apiTest,
} from "@fixtures/api/automation-exercise/api.fixture";
import { loginApiFixtures } from "@fixtures/api/automation-exercise/login-api.fixtures";
import { LoginApiFlows } from "@models/api/automation-exercise/login-api.types";
import { businessStep } from "@support/common/generic/business-function-messages";

const test = apiTest.extend<LoginApiFlows>(loginApiFixtures);

test.describe("Update Account Resources Tests", () => {
  test("API 13: PUT METHOD To Update User Account", async ({
    registerUserByApi,
    updateAccountMethods,
  }) => {
    // Given...
    registerUserByApi.country = "Australia";
    registerUserByApi.city = "Melbourne";
    registerUserByApi.state = "Victoria";

    // When...
    const updateAccountResponse =
      await updateAccountMethods.putToUpdateAccount(registerUserByApi);

    // Then...
    const response = await updateAccountResponse.json();
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
