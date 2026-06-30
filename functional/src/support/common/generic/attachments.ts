import type { TestInfo } from "@playwright/test";

function attachJson(
  testInfo: TestInfo,
  name: string,
  data: unknown,
  options?: { pretty?: boolean },
) {
  const pretty = options?.pretty ?? true;
  testInfo.attach(name, {
    body:
      data === undefined
        ? "undefined"
        : JSON.stringify(data, null, pretty ? 2 : 0),
    contentType: "application/json",
  });
}



function isEmptyPayload(data: unknown): boolean {
  if (data === undefined || data === null) return true;
  if (typeof data === "string") return data.trim().length === 0;
  if (typeof data === "object") {
    if (Array.isArray(data)) return data.length === 0;
    return Object.keys(data as Record<string, unknown>).length === 0;
  }
  return false;
}

function attachJsonIfNotEmpty(
  testInfo: TestInfo,
  name: string,
  data: unknown,
) {
  if (isEmptyPayload(data)) return;
  attachJson(testInfo, name, data);
}



function attachEmptyJsonPlaceholder(
  testInfo: TestInfo,
  name: string,
  placeholder: string = "{}",
) {
  testInfo.attach(name, {
    body: placeholder,
    contentType: "application/json",
  });
}

function attachApiRequest(
  testInfo: TestInfo,
  method: string,
  path: string,
  requestBody?: unknown,
) {
  const name = `[Request] ${method} ${path}`;
  if (isEmptyPayload(requestBody)) {
    attachEmptyJsonPlaceholder(testInfo, name, "{}");
    return;
  }
  attachJson(testInfo, name, requestBody);
}

function attachApiResponse(
  testInfo: TestInfo,
  method: string,
  path: string,
  responseBody: unknown,
) {
  const name = `[Response] ${method} ${path}`;
  attachJson(testInfo, name, responseBody);
}

export const attachments = {
  attachJson,
  attachJsonIfNotEmpty,
  attachApiRequest,
  attachApiResponse,
};
