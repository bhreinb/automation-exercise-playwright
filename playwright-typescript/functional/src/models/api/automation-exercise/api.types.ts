import type { EndpointMethodsFactory } from "@facade/api/http-client/automation-exercise/endpoint.methods.factory";

export type ApiFixtures = {
  products: ReturnType<EndpointMethodsFactory["products"]>;
  brands: ReturnType<EndpointMethodsFactory["brands"]>;
  account: ReturnType<EndpointMethodsFactory["account"]>;
};
