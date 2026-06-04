import {
  test,
  expect,
} from "../../../src/api/fixtures/automation-exercise/api.fixture";
import { AutomationUser } from "../../../src/common/models/automation-exercise/types";
import { TestData } from "../../../src/common/payloads/automation-exercise/test-data";

test.describe("Verify Login Resources Tests", () => {
  test("API 7: POST To Verify Login with valid details", async ({
    createAccountMethods,
    verifyLoginMethods,
  }) => {
    // Given...
    const fakeUser: AutomationUser = TestData.createMinimalFakeUser();
    const createAccountsResponse =
      await createAccountMethods.postToCreateAccount(fakeUser);
    const response = await createAccountsResponse.json();
    expect(response.responseCode).toEqual(201);
    expect(response.message).toEqual("User created!");

    // When...
    const verifyLoginResponse = await verifyLoginMethods.postToVerifyLogin({
      email: fakeUser.email,
      password: fakeUser.password,
    });

    // Then...
    const responseTwo = await verifyLoginResponse.json();
    expect(responseTwo.responseCode).toEqual(200);
    expect(responseTwo.message).toEqual("User exists!");
  });

  test("API 8: POST To Verify Login without email parameter", async ({
    verifyLoginMethods,
  }) => {
    // Given & When...
    const verifyLoginResponse = await verifyLoginMethods.postToVerifyLogin({
      password: "password123",
    });

    // Then...
    const response = await verifyLoginResponse.json();
    expect(response.responseCode).toEqual(400);
    expect(response.message).toEqual(
      "Bad request, email or password parameter is missing in POST request.",
    );
  });

  test("API 9: DELETE To Verify Login", async ({ verifyLoginMethods }) => {
    // Given & When...
    const verifyLoginResponse = await verifyLoginMethods.deleteToVerifyLogin();

    // Then...
    const response = await verifyLoginResponse.json();
    expect(response.responseCode).toEqual(405);
    expect(response.message).toEqual("This request method is not supported.");
  });

  test("API 10: POST To Verify Login with invalid details", async ({
    verifyLoginMethods,
  }) => {
    // Given & When...
    const verifyLoginResponse = await verifyLoginMethods.postToVerifyLogin({
      email: "joe.bloggs@email.com",
      password: "password123",
    });

    // Then...
    const response = await verifyLoginResponse.json();
    expect(response.responseCode).toEqual(404);
    expect(response.message).toEqual("User not found!");
  });
});
