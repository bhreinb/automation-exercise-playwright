import {
  test,
  expect,
} from "../../../src/api/fixtures/automation-exercise/api.fixture";

test.describe("Products Resources Tests", () => {
  test(
    "API 1: GET All Products List",
    { tag: ['@smoke', '@regression'] },
    async ({
      productsMethods,
    }) => {
    // Given & When...
    const productsResponse = await productsMethods.getAllProducts();

    // Then...
    const response = await productsResponse.json();
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

  test(
    "API 2: POST To All Products List",
    { tag: '@regression' },
    async ({
      productsMethods,
    }) => {
    // Given & When...
    const productsResponse = await productsMethods.postToAllProducts();

    // Then...
    const response = await productsResponse.json();
    expect(response.responseCode).toEqual(405);
    expect(response.message).toEqual("This request method is not supported.");
  });
});
