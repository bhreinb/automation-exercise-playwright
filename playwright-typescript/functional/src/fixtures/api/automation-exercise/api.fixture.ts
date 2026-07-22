import { expect } from "@expectations/custom/generic/expect-extensions";
import { EndpointMethodsFactory } from "@facade/api/http-client/automation-exercise/endpoint.methods.factory";
import type { ApiFixtures } from "@models/api/automation-exercise/api.types";
import type { APIRequestContext, Fixtures } from "@playwright/test";
import { test as base } from "@playwright/test";

export const apiFixtures: Fixtures = {
  products: [
    async (
      { request }: { request: APIRequestContext },
      use: (methods: ApiFixtures["products"]) => Promise<void>,
    ) => {
      const catalog = new EndpointMethodsFactory(request);
      await use(catalog.products());
    },
    { box: "self" },
  ],

  brands: [
    async (
      { request }: { request: APIRequestContext },
      use: (methods: ApiFixtures["brands"]) => Promise<void>,
    ) => {
      const catalog = new EndpointMethodsFactory(request);
      await use(catalog.brands());
    },
    { box: "self" },
  ],

  account: [
    async (
      { request }: { request: APIRequestContext },
      use: (methods: ApiFixtures["account"]) => Promise<void>,
    ) => {
      const catalog = new EndpointMethodsFactory(request);
      await use(catalog.account());
    },
    { box: "self" },
  ],
};

export const test = base.extend<ApiFixtures>(apiFixtures);

export { expect };
