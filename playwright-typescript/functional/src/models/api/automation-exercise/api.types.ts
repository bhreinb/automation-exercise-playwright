import type { EndpointMethodsFactory } from "@facade/api/http-client/automation-exercise/endpoint.methods.factory";

export type ApiFixtures = {
  productsMethods: ReturnType<EndpointMethodsFactory["productsResources"]>;
  brandsMethods: ReturnType<EndpointMethodsFactory["brandsResources"]>;
  productsSearchMethods: ReturnType<
    EndpointMethodsFactory["productsSearchResources"]
  >;
  verifyLoginMethods: ReturnType<
    EndpointMethodsFactory["verifyLoginResources"]
  >;
  createAccountMethods: ReturnType<
    EndpointMethodsFactory["createAccountResources"]
  >;
  deleteAccountMethods: ReturnType<
    EndpointMethodsFactory["deleteAccountResources"]
  >;
  updateAccountMethods: ReturnType<
    EndpointMethodsFactory["updateAccountResources"]
  >;
  userAccountMethods: ReturnType<
    EndpointMethodsFactory["userAccountResources"]
  >;
};
