import { APIRequestContext } from "@playwright/test";

export type ApiQueryParams = NonNullable<
  Parameters<APIRequestContext["get"]>[1]
>["params"];

export type ApiFormPayload = NonNullable<
  Parameters<APIRequestContext["post"]>[1]
>["form"];
