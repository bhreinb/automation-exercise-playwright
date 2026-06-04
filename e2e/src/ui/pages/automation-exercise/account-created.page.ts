import { Locator, Page } from "@playwright/test";
import { HeaderPage } from "./header.page";

export class AccountCreatedPage extends HeaderPage {
  /**
   * Reference to the visible "Congratulations! ..." message on the Account Created page.
   */
  readonly congratulationsMessage: Locator;

  constructor(public page: Page) {
    super(page);
    // Example: <p>Congratulations! Your new account has been successfully created!</p>
    this.congratulationsMessage = this.page
      .locator("section#form p")
      .filter({ hasText: /Congratulations!/i })
      .first();
  }

  url(): string {
    return "/account-created";
  }

  async pageLoaded(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
    const title = await this.page.title();
    if (!/Automation Exercise - Account Created/i.test(title)) {
      throw new Error(`Unexpected page title: ${title}`);
    }
    // h2[data-qa="account-created"] — keep heading lookup local
    const accountCreatedHeading = this.page.locator(
      'h2[data-qa="account-created"]',
    );
    await accountCreatedHeading.waitFor({ state: "visible" });
    const headingText =
      (await accountCreatedHeading.textContent())?.trim() ?? "";
    if (!/ACCOUNT CREATED!?/i.test(headingText)) {
      throw new Error(`Unexpected account created heading: "${headingText}"`);
    }
    // Ensure the confirmation copy is present
    await this.congratulationsMessage.waitFor({ state: "visible" });
  }
}
