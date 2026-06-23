import { Page, test } from "@playwright/test";
import { businessFunctionTested } from "@support/common/generic/business-function-messages";

export class HeaderComponent {
  logoutLink = this.page.getByRole("link", { name: /logout/i });
  deleteLink = this.page.getByRole("link", { name: /delete account/i });
  loggedInAsText = this.page.locator("ul.navbar-nav >> text=/Logged in as/i");

  public constructor(protected page: Page) {}

  /**
   * Returns the currently logged-in user, extracted from: "Logged in as <UserName>".
   * Wrapped in a boxed step to hide low-level string slicing and textContent logs.
   */
  async getLoggedInUser(): Promise<string> {
    return await test.step(
      businessFunctionTested(
        "Extract authenticated username from the navigation header context",
      ),
      async () => {
        const raw = (await this.loggedInAsText.first().textContent()) ?? "";
        return raw.replace(/Logged in as/i, "").trim();
      },
    );
  }

  /**
   * Safely terminates the current active user session via the UI header layout.
   */
  async logout(): Promise<void> {
    await test.step(
      businessFunctionTested(
        "Terminate user authentication session via header logout",
      ),
      async () => {
        await this.logoutLink.click();
      },
    );
  }
}
