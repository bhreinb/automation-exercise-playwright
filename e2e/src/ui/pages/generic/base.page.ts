import { Page } from "@playwright/test";

export abstract class BasePage {
  protected constructor(protected page: Page) {}

  /**
   * Absolute URL (or path relative to Playwright baseURL).
   * Example: `/signup` or `https://example.com/signup`.
   */
  abstract url(): string;

  /**
   * Implementations should wait until the page is fully ready for interactions
   * (e.g. via locators, text, or waitForLoadState).
   */
  abstract pageLoaded(): Promise<void>;

  async goto() {
    await this.page.goto(this.url());
    await this.page.waitForURL(this.url());
    await this.pageLoaded();
  }
}
