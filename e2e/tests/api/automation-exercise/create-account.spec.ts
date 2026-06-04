import {
  test,
  expect,
} from "../../../src/api/fixtures/automation-exercise/api.fixture";
import { TestData } from "../../../src/common/payloads/automation-exercise/test-data";
import { AutomationUser } from "../../../src/common/models/automation-exercise/types";

test.describe("Create Account Resources Tests", () => {
  test("API 11: POST To Create/Register User Account", async ({
    createAccountMethods,
  }) => {
    // Given...
    const fakeUser: AutomationUser = TestData.createFullFakeUser();

    // When...
    const createAccountsResponse =
      await createAccountMethods.postToCreateAccount(fakeUser);

    // Then...
    const response = await createAccountsResponse.json();
    expect(response.responseCode).toEqual(201);
    expect(response.message).toEqual("User created!");
  });
});
