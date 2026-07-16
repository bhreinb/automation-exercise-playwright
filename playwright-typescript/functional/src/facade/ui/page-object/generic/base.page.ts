import { Page, test, TestInfo } from "@playwright/test";
import {
  businessFunctionTested,
  businessStep,
} from "@support/common/generic/business-function-messages";

export abstract class BasePage {
  protected constructor(protected page: Page) {}

  /**
   * Absolute URL (or path relative to Playwright baseURL).
   * Example: `/signup` or `https://example.com/signup`.
   */
  abstract url(): string;

  /**
   * Child classes implement low-level locator checks here.
   * Scoped as protected so only BasePage and children can touch it.
   */
  protected abstract pageLoaded(): Promise<void>;

  /**
   * Public structural assertion gateway accessible by your test scripts.
   * Guarantees a clean, standardized reporting block whenever executed.
   */
  async verifyPageLoaded(): Promise<void> {
    const businessViewName = this.constructor.name.replace("Page", "");
    await test.step(
      businessStep(
        `Verify '${businessViewName}' view structure has settled successfully`,
      ),
      async () => {
        await this.pageLoaded(); // Calls the child implementation securely within the wrapper
      },
      { box: true },
    );
  }

  /**
   * Universal entry-point navigation.
   */
  async goto(): Promise<void> {
    const businessViewName = this.constructor.name.replace("Page", "");
    await test.step(
      businessStep(`Navigate to the '${businessViewName}' application view`),
      async () => {
        await this.page.goto(this.url());
        await this.page.waitForURL(this.url());
        // Only this part is wrapped in businessFunctionTested
        await test.step(
          businessFunctionTested(
            `Verify '${businessViewName}' view structure has settled successfully`,
          ),
          async () => {
            await this.pageLoaded();
          },
          { box: true },
        );
      },
      { box: true },
    );
  }

  /**
   * Normalizes URLs used in assertions by removing a single trailing slash.
   * Example: `https://example.com/` -> `https://example.com`
   */
  normalizeUrl(url: string): string {
    // Remove hash fragments (e.g. "#google_vignette") because they are not part of the routing we assert on.
    // Also remove a single trailing slash for stable equality comparisons.
    return url.replace(/#.*$/, "").replace(/\/$/, "");
  }

  /**
   * Current page URL normalized for equality comparisons.
   */
  getCurrentUrlNormalized(): string {
    return this.normalizeUrl(this.page.url());
  }

  /**
   * Playwright `baseURL` from `testInfo` normalized for equality comparisons.
   */
  getBaseUrlNormalized(testInfo: TestInfo): string {
    return this.normalizeUrl(testInfo.project.use?.baseURL ?? "");
  }
}
