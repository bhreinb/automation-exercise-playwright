import { test, expect } from "@fixtures/api/automation-exercise/api.fixture";
import { attachments } from "@support/common/generic/attachments";
import { businessStep } from "@support/common/generic/business-function-messages";

test.describe("Products Resources Tests", () => {
  test(
    "API 1: GET All Products List",
    { tag: ["@smoke", "@regression"] },
    async ({ products }, testInfo) => {
      attachments.attachApiRequest(testInfo, "GET", "/api/productsList", {});

      // Given & When...
      const productsResponse = await products.getAllProducts();

      // Then...
      const response = await productsResponse.json();
      attachments.attachApiResponse(
        testInfo,
        "GET",
        "/api/productsList",
        response,
      );

      expect(
        response.responseCode,
        businessStep("retrieve all products list returns HTTP 200."),
      ).toEqual(200);
      expect(
        response.products,
        businessStep("products list is not null."),
      ).not.toBeNull();
      expect(
        response.products.length,
        businessStep("products list has items."),
      ).toBeGreaterThan(0);
      expect(
        Array.isArray(response.products),
        businessStep("products list is an array."),
      ).toBe(true);

      response.products.forEach((product: object, index: number) => {
        expect(
          Object.keys(product).sort(),
          businessStep(
            `product #${index + 1} has properties id, name, price, brand and category.`,
          ),
        ).toEqual(["brand", "category", "id", "name", "price"].sort());
      });
    },
  );

  test(
    "API 2: POST To All Products List",
    { tag: "@regression" },
    async ({ products }, testInfo) => {
      attachments.attachApiRequest(testInfo, "POST", "/api/productsList", {});

      // Given & When...
      const productsResponse = await products.postToAllProducts();

      // Then...
      const response = await productsResponse.json();
      attachments.attachApiResponse(
        testInfo,
        "POST",
        "/api/productsList",
        response,
      );

      expect(
        response.responseCode,
        businessStep(
          "reject unsupported POST method on products list returns HTTP 405.",
        ),
      ).toEqual(405);
      expect(
        response.message,
        businessStep("unsupported POST returns correct message."),
      ).toEqual("This request method is not supported.");
    },
  );
});
