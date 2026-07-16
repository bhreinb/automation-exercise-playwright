import { expect } from "@expectations/custom/generic/expect-extensions";
import type { BrowserContext, Fixtures, Route } from "@playwright/test";
import { test as base } from "@playwright/test";

// Keep the ad-blocker completely out of the report.
//
// - It hooks into `context`, not `page`, so it does not introduce an extra
//   dependency on the built-in `page` fixture.
// - `box: "self"` prevents Playwright/Allure from emitting this fixture as a
//   visible fixture step at all.
export const adBlockerFixtures: Fixtures = {
  adBlocker: [
    async (
      { context }: { context: BrowserContext },
      use: (adBlocker: void) => Promise<void>,
    ) => {
      const adDomains: string[] = [
        "googlesyndication.com",
        "://google.com",
        "doubleclick.net",
        "googleads.g.doubleclick.net",
      ];

      await context.route("**/*", (route: Route) => {
        const url: string = route.request().url();
        if (adDomains.some((domain: string) => url.includes(domain))) {
          return route.abort();
        }
        return route.continue();
      });

      await use(undefined);
    },
    { auto: true, box: "self" },
  ],
};

export const test = base.extend<{ adBlocker: void }>(adBlockerFixtures);

export { expect };
