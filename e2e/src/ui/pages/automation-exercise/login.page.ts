import { Locator, Page } from "@playwright/test";
import { HeaderPage } from "./header.page";

export class LoginPage extends HeaderPage {
  readonly name: Locator;
  readonly signUpEmail: Locator;
  readonly signup: Locator;
  readonly registeredEmail: Locator;
  readonly password: Locator;
  readonly login: Locator;
  readonly loginErrorMessage: Locator;

  constructor(public page: Page) {
    super(page);
    this.name = this.page.locator('input[data-qa="signup-name"]');
    this.signUpEmail = this.page.locator('input[data-qa="signup-email"]');
    this.signup = this.page.locator('button[data-qa="signup-button"]');
    this.registeredEmail = this.page.locator('input[data-qa="login-email"]');
    this.password = this.page.locator('input[data-qa="login-password"]');
    this.login = this.page.locator('button[data-qa="login-button"]');
    this.loginErrorMessage = this.page.locator(".login-form p", {
      hasText: "Your email or password is incorrect!",
    });
  }

  async pageLoaded(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
    const title = await this.page.title();
    if (!/Automation Exercise - Signup \/ Login/i.test(title)) {
      throw new Error(`Unexpected page title: ${title}`);
    }
    const loginForm = this.page.locator(".login-form");
    const signupForm = this.page.locator(".signup-form");
    await loginForm.waitFor({ state: "visible" });
    await signupForm.waitFor({ state: "visible" });
    const loginHeading = (await loginForm.locator("h2").textContent())?.trim();
    const signupHeading = (
      await signupForm.locator("h2").textContent()
    )?.trim();
    if (loginHeading !== "Login to your account") {
      throw new Error(`Unexpected login heading: ${loginHeading}`);
    }
    if (signupHeading !== "New User Signup!") {
      throw new Error(`Unexpected signup heading: ${signupHeading}`);
    }
  }

  url(): string {
    return "/login";
  }

  async setName(name: string) {
    await this.name.fill(name);
  }

  async setEmail(email: string) {
    await this.signUpEmail.fill(email);
  }

  async submitSignup() {
    await this.signup.click();
  }

  async setRegisteredEmail(email: string) {
    await this.registeredEmail.fill(email);
  }

  async setPassword(password: string) {
    await this.password.fill(password);
  }

  async submitLogin() {
    await this.login.click();
  }

  async isLoginErrorVisible() {
    return await this.loginErrorMessage.isVisible();
  }
}
