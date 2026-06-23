import {
  ApiFormPayload,
  ApiQueryParams,
} from "@models/api/generic/http-request.types";
import { APIRequestContext, APIResponse, test } from "@playwright/test";
import { businessStep } from "@support/common/generic/business-function-messages";

export class BaseApiClient {
  constructor(protected request: APIRequestContext) {}

  async get(url: string, params: ApiQueryParams = {}): Promise<APIResponse> {
    return await test.step(
      businessStep(`GET "${url}"`),
      async () => {
        return await this.request.get(url, {
          params,
          failOnStatusCode: false,
        });
      },
      { box: true },
    );
  }

  async post(url: string, form: ApiFormPayload): Promise<APIResponse> {
    return await test.step(
      businessStep(`POST "${url}"`),
      async () => {
        return await this.request.post(url, {
          form,
          failOnStatusCode: false,
        });
      },
      { box: true },
    );
  }

  async put(url: string, form: ApiFormPayload): Promise<APIResponse> {
    return await test.step(
      businessStep(`PUT "${url}"`),
      async () => {
        return await this.request.put(url, {
          form,
          failOnStatusCode: false,
        });
      },
      { box: true },
    );
  }

  async delete(url: string, form: ApiFormPayload): Promise<APIResponse> {
    return await test.step(
      businessStep(`DELETE "${url}"`),
      async () => {
        return await this.request.delete(url, {
          form,
          failOnStatusCode: false,
        });
      },
      { box: true },
    );
  }
}
