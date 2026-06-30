import { test, expect } from "@fixtures/api/automation-exercise/api.fixture";
import { attachments } from "@support/common/generic/attachments";
import { businessStep } from "@support/common/generic/business-function-messages";

test.describe("Search Product Resources Tests", () => {
  test(
    "API 5: POST To Search Product",
    { tag: ["@smoke", "@regression"] },
    async ({ productsSearchMethods }, testInfo) => {
      const request = {
        search_product: "tshirt",
      };

      attachments.attachApiRequest(
        testInfo,
        "POST",
        "/api/searchProduct",
        request,
      );

      // Given & When...
      const searchProductResponse =
        await productsSearchMethods.postToSearchProduct(request);

      // Then...
      const response = await searchProductResponse.json();
      attachments.attachApiResponse(
        testInfo,
        "POST",
        "/api/searchProduct",
        response,
      );

      expect(
        response.responseCode,
        businessStep("search product returns HTTP 200."),
      ).toEqual(200);
      expect(
        response.products,
        businessStep("search result products is not null."),
      ).not.toBeNull();
      expect(
        response.products.length,
        businessStep("search result has items."),
      ).toBeGreaterThan(0);
      expect(
        Array.isArray(response.products),
        businessStep("search result products is an array."),
      ).toBe(true);

      response.products.forEach((product: object, index: number) => {
        expect(
          Object.keys(product).sort(),
          businessStep(
            `search result product #${index + 1} has properties id, name, price, brand and category.`,
          ),
        ).toEqual(["brand", "category", "id", "name", "price"].sort());
      });
    },
  );

  test(
    "API 6: POST To Search Product without search_product parameter",
    async ({ productsSearchMethods }, testInfo) => {
      const request = {};

      attachments.attachApiRequest(
        testInfo,
        "POST",
        "/api/searchProduct",
        request,
      );

      // Given & When...
      const searchProductResponse =
        await productsSearchMethods.postToSearchProduct(request);

      // Then...
      const response = await searchProductResponse.json();
      attachments.attachApiResponse(
        testInfo,
        "POST",
        "/api/searchProduct",
        response,
      );

      expect(
        response.responseCode,
        businessStep("missing search_product parameter returns HTTP 400."),
      ).toEqual(400);
      expect(
        response.message,
        businessStep("missing search_product parameter returns correct message."),
      ).toEqual(
        "Bad request, search_product parameter is missing in POST request.",
      );
    },
  );
});
