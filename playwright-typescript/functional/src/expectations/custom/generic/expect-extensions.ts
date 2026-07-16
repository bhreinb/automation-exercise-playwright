import { expect as baseExpect } from "@playwright/test";
import type { TestInfo } from "@playwright/test";

const normalizeUrl = (url: string): string => url.replace(/\/$/, "");

export const expect = baseExpect.extend({
  /**
   * Compares a received URL to Playwright's `baseURL` from `testInfo`,
   * after normalizing both by removing a single trailing slash.
   */
  toBeNormalizedBaseUrl(received: string, testInfo: TestInfo) {
    const baseUrl = normalizeUrl(testInfo.project.use?.baseURL ?? "");
    const receivedNormalized = normalizeUrl(received);

    const pass = receivedNormalized === baseUrl;

    return {
      pass,
      message: () =>
        pass
          ? `expected URL not to equal baseURL (both normalized to: ${baseUrl})`
          : `expected normalized URL to equal baseURL\n\nreceived (normalized): ${receivedNormalized}\nexpected (normalized): ${baseUrl}`,
    };
  },
});

declare module "@playwright/test" {
  interface Matchers<R> {
    toBeNormalizedBaseUrl(received: string, testInfo: TestInfo): R;
  }
}
