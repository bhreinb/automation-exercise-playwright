import { test, expect } from "@fixtures/api/automation-exercise/api.fixture";
import { attachments } from "@support/common/generic/attachments";
import { businessStep } from "@support/common/generic/business-function-messages";

test.describe("Brands Resources Tests", () => {
  test(
    "API 3: GET All Brands List",
    { tag: ["@smoke", "@regression"] },
    async ({ brandsMethods }, testInfo) => {
      attachments.attachApiRequest(testInfo, "GET", "/api/brandsList", {});

      // Given & When...
      const brandsResponse = await brandsMethods.getAllBrands();

      // Then...
      const response = await brandsResponse.json();
      attachments.attachApiResponse(
        testInfo,
        "GET",
        "/api/brandsList",
        response,
      );

      expect(
        response.responseCode,
        businessStep("retrieve all brands list returns HTTP 200."),
      ).toEqual(200);
      expect(
        response.brands,
        businessStep("brands list is not null."),
      ).not.toBeNull();
      expect(
        response.brands.length,
        businessStep("brands list has items."),
      ).toBeGreaterThan(0);
      expect(
        Array.isArray(response.brands),
        businessStep("brands list is an array."),
      ).toBe(true);

      response.brands.forEach((brand: object, index: number) => {
        expect(
          Object.keys(brand).sort(),
          businessStep(`brand #${index + 1} has properties id and brand.`),
        ).toEqual(["brand", "id"].sort());
      });
    },
  );

  test(
    "API 4: PUT To All Brands List",
    { tag: "@regression" },
    async ({ brandsMethods }, testInfo) => {
      attachments.attachApiRequest(testInfo, "GET", "/api/brandsList", {});

      // Given & When...
      const productsResponse = await brandsMethods.putToAllBrands();

      // Then...
      const response = await productsResponse.json();
      attachments.attachApiResponse(
        testInfo,
        "PUT",
        "/api/brandsList",
        response,
      );

      expect(
        response.responseCode,
        businessStep(
          "reject unsupported PUT method on brands list returns HTTP 405.",
        ),
      ).toEqual(405);
      expect(
        response.message,
        businessStep("unsupported PUT returns correct message."),
      ).toEqual("This request method is not supported.");
    },
  );
});
