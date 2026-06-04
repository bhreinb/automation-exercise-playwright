import { APIRequestContext } from "@playwright/test";

export class BaseApiClient {
  constructor(protected request: APIRequestContext) {}

  async get(url: string, params: any) {
    return await this.request.get(url, {
      params: params,
      failOnStatusCode: false,
    });
  }

  async post(url: string, form: any) {
    return await this.request.post(url, {
      form: form,
      failOnStatusCode: false,
    });
  }

  async put(url: string, form: any) {
    return await this.request.put(url, {
      form: form,
      failOnStatusCode: false,
    });
  }

  async delete(url: string, form: any) {
    return await this.request.delete(url, {
      form: form,
      failOnStatusCode: false,
    });
  }
}
