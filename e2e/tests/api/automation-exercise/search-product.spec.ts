import {
  test,
  expect,
} from "../../../src/api/fixtures/automation-exercise/api.fixture";

test.describe("Search Product Resources Tests", () => {
  test(
    "API 5: POST To Search Product",
    { tag: ['@smoke', '@regression'] },
    async ({
      productsSearchMethods,
    }) => {
    // Given & When...
    const searchProductResponse =
      await productsSearchMethods.postToSearchProduct({
        search_product: "tshirt",
      });

    // Then...
    const response = await searchProductResponse.json();
    expect(response.responseCode).toEqual(200);
    expect(response.products).not.toBeNull();
    expect(response.products.length).toBeGreaterThan(0);
    expect(Array.isArray(response.products)).toBe(true);
    response.products.forEach((product) => {
      expect(Object.keys(product).sort()).toEqual(
        ["brand", "category", "id", "name", "price"].sort(),
      );
    });
  });

  test("API 6: POST To Search Product ", async ({ productsSearchMethods }) => {
    // Given & When...
    const searchProductResponse =
      await productsSearchMethods.postToSearchProduct({});

    // Then...
    const response = await searchProductResponse.json();
    expect(response.responseCode).toEqual(400);
    expect(response.message).toEqual(
      "Bad request, search_product parameter is missing in POST request.",
    );
  });
});
