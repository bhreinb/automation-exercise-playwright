import { expect } from "@expectations/custom/generic/expect-extensions";
import { EndpointMethodsFactory } from "@facade/http-client/automation-exercise/endpoint.methods.factory";
import type { ApiFixtures } from "@models/api/automation-exercise/api.types";
import type { APIRequestContext, Fixtures } from "@playwright/test";
import { test as base } from "@playwright/test";

export const apiFixtures: Fixtures = {
  productsMethods: [
    async (
      { request }: { request: APIRequestContext },
      use: (methods: ApiFixtures["productsMethods"]) => Promise<void>,
    ) => {
      const catalog = new EndpointMethodsFactory(request);
      await use(catalog.productsResources());
    },
    { box: "self" },
  ],

  brandsMethods: [
    async (
      { request }: { request: APIRequestContext },
      use: (methods: ApiFixtures["brandsMethods"]) => Promise<void>,
    ) => {
      const catalog = new EndpointMethodsFactory(request);
      await use(catalog.brandsResources());
    },
    { box: "self" },
  ],

  productsSearchMethods: [
    async (
      { request }: { request: APIRequestContext },
      use: (methods: ApiFixtures["productsSearchMethods"]) => Promise<void>,
    ) => {
      const catalog = new EndpointMethodsFactory(request);
      await use(catalog.productsSearchResources());
    },
    { box: "self" },
  ],

  verifyLoginMethods: [
    async (
      { request }: { request: APIRequestContext },
      use: (methods: ApiFixtures["verifyLoginMethods"]) => Promise<void>,
    ) => {
      const catalog = new EndpointMethodsFactory(request);
      await use(catalog.verifyLoginResources());
    },
    { box: "self" },
  ],

  createAccountMethods: [
    async (
      { request }: { request: APIRequestContext },
      use: (methods: ApiFixtures["createAccountMethods"]) => Promise<void>,
    ) => {
      const catalog = new EndpointMethodsFactory(request);
      await use(catalog.createAccountResources());
    },
    { box: "self" },
  ],

  deleteAccountMethods: [
    async (
      { request }: { request: APIRequestContext },
      use: (methods: ApiFixtures["deleteAccountMethods"]) => Promise<void>,
    ) => {
      const catalog = new EndpointMethodsFactory(request);
      await use(catalog.deleteAccountResources());
    },
    { box: "self" },
  ],

  updateAccountMethods: [
    async (
      { request }: { request: APIRequestContext },
      use: (methods: ApiFixtures["updateAccountMethods"]) => Promise<void>,
    ) => {
      const catalog = new EndpointMethodsFactory(request);
      await use(catalog.updateAccountResources());
    },
    { box: "self" },
  ],

  userAccountMethods: [
    async (
      { request }: { request: APIRequestContext },
      use: (methods: ApiFixtures["userAccountMethods"]) => Promise<void>,
    ) => {
      const catalog = new EndpointMethodsFactory(request);
      await use(catalog.userAccountResources());
    },
    { box: "self" },
  ],
};

export const test = base.extend<ApiFixtures>(apiFixtures);

export { expect };
