import { BaseApiClient } from "../generic/base.api";

export class EndpointMethodsFactory extends BaseApiClient {
  productsResources() {
    const productsListPath: string = "/api/productsList";
    return {
      getAllProducts: () => this.get(productsListPath, {}),
      postToAllProducts: () => this.post(productsListPath, {}),
    };
  }

  brandsResources() {
    const brandsListPath: string = "/api/brandsList";
    return {
      getAllBrands: () => this.get(brandsListPath, {}),
      putToAllBrands: () => this.put(brandsListPath, {}),
    };
  }

  productsSearchResources() {
    const productsSearchPath = "/api/searchProduct";
    return {
      postToSearchProduct: (form: any) => this.post(productsSearchPath, form),
    };
  }

  verifyLoginResources() {
    const verifyLoginPath: string = "/api/verifyLogin";
    return {
      postToVerifyLogin: (form: any) => this.post(verifyLoginPath, form),
      deleteToVerifyLogin: () => this.delete(verifyLoginPath, {}),
    };
  }

  createAccountResources() {
    const createAccountPath: string = "/api/createAccount";
    return {
      postToCreateAccount: (form: any) => this.post(createAccountPath, form),
    };
  }

  deleteAccountResources() {
    const deleteAccountPath: string = "/api/deleteAccount";
    return {
      deleteAccount: (form: any) => this.delete(deleteAccountPath, form),
    };
  }

  updateAccountResources() {
    const updateAccountPath: string = "/api/updateAccount";
    return {
      putToUpdateAccount: (form: any) => this.put(updateAccountPath, form),
    };
  }

  userAccountResources() {
    const getUserDetailByEmailPath: string = "/api/getUserDetailByEmail";
    return {
      getUserDetailByEmail: (form: any) =>
        this.get(getUserDetailByEmailPath, form),
    };
  }
}
