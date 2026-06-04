import {
  test,
  expect,
} from "../../../src/api/fixtures/automation-exercise/api.fixture";

test.describe("Brands Resources Tests", () => {
  test(
    "API 3: GET All Brands List",
    { tag: ['@smoke', '@regression'] },
    async ({
      brandsMethods,
    }) => {
    // Given & When...
    const brandsResponse = await brandsMethods.getAllBrands();

    // Then...
    const response = await brandsResponse.json();
    expect(response.responseCode).toEqual(200);
    expect(response.brands).not.toBeNull();
    expect(response.brands.length).toBeGreaterThan(0);
    expect(Array.isArray(response.brands)).toBe(true);
    response.brands.forEach((brand) => {
      expect(Object.keys(brand).sort()).toEqual(["brand", "id"].sort());
    });
  });

  test(
    "API 4: PUT To All Brands List",
    { tag: '@regression' },
    async ({
      brandsMethods,
    }) => {
    // Given & When...
    const productsResponse = await brandsMethods.putToAllBrands();

    // Then...
    const response = await productsResponse.json();
    expect(response.responseCode).toEqual(405);
    expect(response.message).toEqual("This request method is not supported.");
  });
});
