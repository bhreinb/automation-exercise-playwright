import { MainApplicationBasePage } from "@facade/ui/page-object/automation-exercise/main-application-base.page";
import { Locator, Page, test } from "@playwright/test";
import { businessStep } from "@support/common/generic/business-function-messages";

export class LoginPage extends MainApplicationBasePage {
  readonly signupName: Locator;
  readonly signupEmail: Locator;
  readonly signupSubmit: Locator;
  readonly loginEmail: Locator;
  readonly loginPassword: Locator;
  readonly loginSubmit: Locator;
  readonly loginErrorMessage: Locator;
  readonly signupErrorMessage: Locator;

  constructor(public page: Page) {
    super(page);
    this.signupName = this.page.getByTestId("signup-name");
    this.signupEmail = this.page.getByTestId("signup-email");
    this.signupSubmit = this.page.getByTestId("signup-button");
    this.loginEmail = this.page.getByTestId("login-email");
    this.loginPassword = this.page.getByTestId("login-password");
    this.loginSubmit = this.page.getByTestId("login-button");
    this.loginErrorMessage = this.page.locator(".login-form p", {
      hasText: "Your email or password is incorrect!",
    });
    this.signupErrorMessage = this.page.locator(".signup-form p", {
      hasText: "Email Address already exist!",
    });
  }

  url(): string {
    return "/login";
  }

  /**
   * Logs in a user using their email and password.
   */
  async login(email: string, pass: string): Promise<void> {
    await test.step(
        businessStep("Log in with user credentials"),
        async () => {
          await this.loginEmail.fill(email);
          await this.loginPassword.fill(pass);
          await this.loginSubmit.click();
        },
    );
  }

  /**
   * Initiates the signup process with a name and email.
   */
  async signup(name: string, email: string): Promise<void> {
    await test.step(
        businessStep("Initiate user signup"),
        async () => {
          await this.signupName.fill(name);
          await this.signupEmail.fill(email);
          await this.signupSubmit.click();
        },
    );
  }

  /**
   * Verified child implementation for authentication forms validation.
   */
  protected async pageLoaded(): Promise<void> {
    // 1. Quick page shell title check
    const title = await this.page.title();
    if (!/Automation Exercise - Signup \/ Login/i.test(title)) {
      throw new Error(`Unexpected page title: ${title}`);
    }
    // 2. Form container visibility checks
    const loginForm = this.page.locator(".login-form");
    const signupForm = this.page.locator(".signup-form");
    await loginForm.waitFor({ state: "visible" });
    await signupForm.waitFor({ state: "visible" });
    // 3. Exact semantic heading validation
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
}
