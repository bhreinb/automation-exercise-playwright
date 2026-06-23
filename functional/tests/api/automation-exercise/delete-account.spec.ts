import {
  test as apiTest,
  expect,
} from "@fixtures/api/automation-exercise/api.fixture";
import { loginApiFixtures } from "@fixtures/api/automation-exercise/login-api.fixtures";
import { LoginApiFlows } from "@models/api/automation-exercise/login-api.types";
import { businessStep } from "@support/common/generic/business-function-messages";

const test = apiTest.extend<LoginApiFlows>(loginApiFixtures);

test.describe("Delete Account Resources Tests", () => {
  test("API 12: DELETE METHOD To Delete User Account", async ({
    registerUserByApi,
    deleteAccountMethods,
  }) => {
    // Given & When...
    const deleteAccountResponse = await deleteAccountMethods.deleteAccount({
      email: registerUserByApi.email,
      password: registerUserByApi.password,
    });

    // Then...
    const response = await deleteAccountResponse.json();
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
