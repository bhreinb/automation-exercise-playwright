import {
  ApiFormPayload,
  ApiQueryParams,
} from "@models/api/generic/http-request.types";

import { BaseApiClient } from "../generic/base.api";

export class EndpointMethodsFactory extends BaseApiClient {
  /**
   * Domain style (mirrors Java EndpointMethodsFactory)
   */
  products() {
    const productsListPath: string = "/api/productsList";
    const productsSearchPath: string = "/api/searchProduct";

    return {
      getAllProducts: () => this.get(productsListPath, {}),
      postToAllProducts: () => this.post(productsListPath, {}),
      postToSearchProduct: (form: ApiFormPayload) =>
        this.post(productsSearchPath, form),
    };
  }

  brands() {
    const brandsListPath: string = "/api/brandsList";

    return {
      getAllBrands: () => this.get(brandsListPath, {}),
      putToAllBrands: () => this.put(brandsListPath, {}),
    };
  }

  account() {
    const verifyLoginPath: string = "/api/verifyLogin";
    const createAccountPath: string = "/api/createAccount";
    const deleteAccountPath: string = "/api/deleteAccount";
    const updateAccountPath: string = "/api/updateAccount";
    const getUserDetailByEmailPath: string = "/api/getUserDetailByEmail";

    return {
      postToVerifyLogin: (form: ApiFormPayload) =>
        this.post(verifyLoginPath, form),
      deleteToVerifyLogin: () => this.delete(verifyLoginPath, {}),

      postToCreateAccount: (form: ApiFormPayload) =>
        this.post(createAccountPath, form),
      deleteAccount: (form: ApiFormPayload) =>
        this.delete(deleteAccountPath, form),

      putToUpdateAccount: (form: ApiFormPayload) =>
        this.put(updateAccountPath, form),

      getUserDetailByEmail: (params: ApiQueryParams) =>
        this.get(getUserDetailByEmailPath, params),
    };
  }
}
