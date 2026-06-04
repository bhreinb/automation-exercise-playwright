import { BasePage } from "../generic/base.page";

export abstract class HeaderPage extends BasePage {
  /** Logout link in the header menu (e.g. <a href="/logout">Logout</a>) */
  logoutLink = this.page.locator('a[href="/logout"]');

  /** Header text like: "Logged in as <UserName>" */
  loggedInAsText = this.page.locator("ul.navbar-nav >> text=/Logged in as/i");

  async isLogoutLinkVisible(): Promise<boolean> {
    return this.logoutLink.isVisible();
  }

  /**
   * Returns the currently logged in user, extracted from:
   * "Logged in as <UserName>".
   */
  async getLoggedInUser(): Promise<string> {
    const raw = (await this.loggedInAsText.first().textContent()) ?? "";
    return raw.replace(/Logged in as/i, "").trim();
  }
}
