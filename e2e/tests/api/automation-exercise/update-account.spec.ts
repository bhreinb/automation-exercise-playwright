import {
  test,
  expect,
} from "../../../src/api/fixtures/automation-exercise/api.fixture";
import { TestData } from "../../../src/common/payloads/automation-exercise/test-data";
import { AutomationUser } from "../../../src/common/models/automation-exercise/types";

test.describe("Update Account Resources Tests", () => {
  test("API 13: PUT METHOD To Update User Account", async ({
    createAccountMethods,
    updateAccountMethods,
  }) => {
    // Given...
    const fakeUser: AutomationUser = TestData.createMinimalFakeUser();
    const createAccountsResponse =
      await createAccountMethods.postToCreateAccount(fakeUser);
    const response = await createAccountsResponse.json();
    expect(response.responseCode).toEqual(201);
    expect(response.message).toEqual("User created!");
    fakeUser.country = "Australia";
    fakeUser.city = "Melbourne";
    fakeUser.state = "Victoria";

    // When...
    const updateAccountResponse =
      await updateAccountMethods.putToUpdateAccount(fakeUser);

    // Then...
    const responseTwo = await updateAccountResponse.json();
    expect(responseTwo.responseCode).toEqual(200);
    expect(responseTwo.message).toEqual("User updated!");
  });
});
