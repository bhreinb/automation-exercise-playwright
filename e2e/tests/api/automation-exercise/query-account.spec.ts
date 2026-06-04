import {
  test,
  expect,
} from "../../../src/api/fixtures/automation-exercise/api.fixture";
import { TestData } from "../../../src/common/payloads/automation-exercise/test-data";
import { AutomationUser } from "../../../src/common/models/automation-exercise/types";

test.describe("User Detail Resources Tests", () => {
  test("API 14: GET user account detail by email", async ({
    createAccountMethods,
    userAccountMethods,
  }) => {
    // Given...
    const fakeUser: AutomationUser = TestData.createMinimalFakeUser();
    const createAccountsResponse =
      await createAccountMethods.postToCreateAccount(fakeUser);
    const response = await createAccountsResponse.json();
    expect(response.responseCode).toEqual(201);
    expect(response.message).toEqual("User created!");

    // When...
    const UserDetailResponse = await userAccountMethods.getUserDetailByEmail({
      email: fakeUser.email,
    });

    // Then...
    const responseTwo = await UserDetailResponse.json();
    expect(responseTwo.responseCode).toEqual(200);
    const expectedUserPropertyNames: string[] = [
      "name",
      "email",
      "title",
      "birth_day",
      "birth_month",
      "birth_year",
      "first_name",
      "last_name",
      "company",
      "address1",
      "address2",
      "country",
      "city",
      "zipcode",
      "state",
    ];
    expectedUserPropertyNames.forEach((prop) => {
      expect(responseTwo.user).toHaveProperty(prop);
    });
  });
});
