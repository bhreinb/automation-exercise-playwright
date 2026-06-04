import {
  test,
  expect,
} from "../../../src/api/fixtures/automation-exercise/api.fixture";
import { TestData } from "../../../src/common/payloads/automation-exercise/test-data";
import { AutomationUser } from "../../../src/common/models/automation-exercise/types";

test.describe("Delete Account Resources Tests", () => {
  test("API 12: DELETE METHOD To Delete User Account", async ({
    createAccountMethods,
    deleteAccountMethods,
  }) => {
    // Given...
    const fakeUser: AutomationUser = TestData.createMinimalFakeUser();
    const createAccountsResponse =
      await createAccountMethods.postToCreateAccount(fakeUser);
    const response = await createAccountsResponse.json();
    expect(response.responseCode).toEqual(201);
    expect(response.message).toEqual("User created!");

    // When...
    const deleteAccountResponse = await deleteAccountMethods.deleteAccount({
      email: fakeUser.email,
      password: fakeUser.password,
    });

    // Then...
    const responseTwo = await deleteAccountResponse.json();
    expect(responseTwo.responseCode).toEqual(200);
    expect(responseTwo.message).toEqual("Account deleted!");
  });
});
