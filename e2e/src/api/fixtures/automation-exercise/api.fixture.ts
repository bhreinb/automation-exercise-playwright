import { test as base, expect } from "@playwright/test";

import { EndpointMethodsFactory } from "../../clients/automation-exercise/endpoint.methods.factory";

type ApiFixtures = {
  allMethods: EndpointMethodsFactory;
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

export const apiFixtures: ApiFixtures = {
  allMethods: async ({ request }, use) => {
    const catalog = new EndpointMethodsFactory(request);
    await use(catalog);
  },

  productsMethods: async ({ allMethods }, use) => {
    await use(allMethods.productsResources());
  },

  brandsMethods: async ({ allMethods }, use) => {
    await use(allMethods.brandsResources());
  },

  productsSearchMethods: async ({ allMethods }, use) => {
    await use(allMethods.productsSearchResources());
  },

  verifyLoginMethods: async ({ allMethods }, use) => {
    await use(allMethods.verifyLoginResources());
  },

  createAccountMethods: async ({ allMethods }, use) => {
    await use(allMethods.createAccountResources());
  },

  deleteAccountMethods: async ({ allMethods }, use) => {
    await use(allMethods.deleteAccountResources());
  },

  updateAccountMethods: async ({ allMethods }, use) => {
    await use(allMethods.updateAccountResources());
  },

  userAccountMethods: async ({ allMethods }, use) => {
    await use(allMethods.userAccountResources());
  },
};

export const test = base.extend<ApiFixtures>(apiFixtures);

export { expect };
