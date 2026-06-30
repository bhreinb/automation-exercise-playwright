import {
  expect,
  test as apiTest,
} from "@fixtures/api/automation-exercise/api.fixture";
import { loginApiFixtures } from "@fixtures/api/automation-exercise/login-api.fixtures";
import { LoginApiFlows } from "@models/api/automation-exercise/login-api.types";
import { attachments } from "@support/common/generic/attachments";
import { businessStep } from "@support/common/generic/business-function-messages";

const test = apiTest.extend<LoginApiFlows>(loginApiFixtures);

test.describe("User Detail Resources Tests", () => {
  test(
    "API 14: GET user account detail by email",
    async ({ registerUserByApi, userAccountMethods }, testInfo) => {
      const request = {
        email: registerUserByApi.email,
      };

      attachments.attachApiRequest(
        testInfo,
        "GET",
        "/api/getUserDetailByEmail",
        request,
      );

      // Given & When...
      const userDetailResponse =
        await userAccountMethods.getUserDetailByEmail(request);

      // Then...
      const response = await userDetailResponse.json();
      attachments.attachApiResponse(
        testInfo,
        "GET",
        "/api/getUserDetailByEmail",
        response,
      );

      expect(
        response.responseCode,
        businessStep("get user detail returns HTTP 200."),
      ).toEqual(200);
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
        expect(
          response.user,
          businessStep(`user detail contains property '${prop}'.`),
        ).toHaveProperty(prop);
      });
    },
  );
});
