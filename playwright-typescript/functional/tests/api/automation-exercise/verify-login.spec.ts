import {
  test as apiTest,
  expect,
} from "@fixtures/api/automation-exercise/api.fixture";
import { loginApiFixtures } from "@fixtures/api/automation-exercise/login-api.fixtures";
import { LoginApiFlows } from "@models/api/automation-exercise/login-api.types";
import { attachments } from "@support/common/generic/attachments";
import { businessStep } from "@support/common/generic/business-function-messages";

const test = apiTest.extend<LoginApiFlows>(loginApiFixtures);

test.describe("Verify Login Resources Tests", () => {
  test("API 7: POST To Verify Login with valid details", async ({
    registerUserByApi,
    verifyLoginMethods,
  }, testInfo) => {
    const request = {
      email: registerUserByApi.email,
      password: registerUserByApi.password,
    };

    attachments.attachApiRequest(testInfo, "POST", "/api/verifyLogin", request);

    // Given & When...
    const verifyLoginResponse =
      await verifyLoginMethods.postToVerifyLogin(request);

    // Then...
    const response = await verifyLoginResponse.json();
    attachments.attachApiResponse(
      testInfo,
      "POST",
      "/api/verifyLogin",
      response,
    );

    expect(
      response.responseCode,
      businessStep("verify login returns HTTP 200."),
    ).toEqual(200);
    expect(
      response.message,
      businessStep("verify login returns success message."),
    ).toEqual("User exists!");
  });

  test("API 8: POST To Verify Login without email parameter", async ({
    verifyLoginMethods,
  }, testInfo) => {
    const request = {
      password: "password123",
    };

    attachments.attachApiRequest(testInfo, "POST", "/api/verifyLogin", request);

    // Given & When...
    const verifyLoginResponse =
      await verifyLoginMethods.postToVerifyLogin(request);

    // Then...
    const response = await verifyLoginResponse.json();
    attachments.attachApiResponse(
      testInfo,
      "POST",
      "/api/verifyLogin",
      response,
    );

    expect(
      response.responseCode,
      businessStep("missing email or password parameter returns HTTP 400."),
    ).toEqual(400);
    expect(
      response.message,
      businessStep(
        "missing email or password parameter returns correct message.",
      ),
    ).toEqual(
      "Bad request, email or password parameter is missing in POST request.",
    );
  });

  test("API 9: DELETE To Verify Login", async ({
    verifyLoginMethods,
  }, testInfo) => {
    attachments.attachApiRequest(testInfo, "DELETE", "/api/verifyLogin", {});

    // Given & When...
    const verifyLoginResponse = await verifyLoginMethods.deleteToVerifyLogin();

    // Then...
    const response = await verifyLoginResponse.json();
    attachments.attachApiResponse(
      testInfo,
      "DELETE",
      "/api/verifyLogin",
      response,
    );

    expect(
      response.responseCode,
      businessStep(
        "reject unsupported DELETE method on login returns HTTP 405.",
      ),
    ).toEqual(405);
    expect(
      response.message,
      businessStep("unsupported DELETE returns correct message."),
    ).toEqual("This request method is not supported.");
  });

  test("API 10: POST To Verify Login with invalid details", async ({
    verifyLoginMethods,
  }, testInfo) => {
    const request = {
      email: "joe.bloggs@email.com",
      password: "password123",
    };

    attachments.attachApiRequest(testInfo, "POST", "/api/verifyLogin", request);

    // Given & When...
    const verifyLoginResponse =
      await verifyLoginMethods.postToVerifyLogin(request);

    // Then...
    const response = await verifyLoginResponse.json();
    attachments.attachApiResponse(
      testInfo,
      "POST",
      "/api/verifyLogin",
      response,
    );

    expect(
      response.responseCode,
      businessStep("invalid login credentials returns HTTP 404."),
    ).toEqual(404);
    expect(
      response.message,
      businessStep("invalid login credentials returns correct message."),
    ).toEqual("User not found!");
  });
});
