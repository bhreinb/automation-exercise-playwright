import { MainApplicationBasePage } from "@facade/page-object/automation-exercise/main-application-base.page";
import { Locator, Page, test } from "@playwright/test";
import { businessStep } from "@support/common/generic/business-function-messages";

export class AccountCreatedPage extends MainApplicationBasePage {
  readonly accountCreatedHeading: Locator;

  constructor(public page: Page) {
    super(page);
    this.accountCreatedHeading = this.page.getByTestId("account-created");
  }

  url(): string {
    return "/account-created";
  }

  /**
   * Executes the final workflow step to route out of the creation lander.
   */
  async proceedToHomepage(): Promise<void> {
    await test.step(
      businessStep("Confirm creation state and proceed to homepage dashboard"),
      async () => {
        await this.universalContinueButton.click();
      },
    );
  }

  /**
   * Verified child implementation for landing state confirmation.
   */
  protected async pageLoaded(): Promise<void> {
    // 1. Structural heading check
    await this.accountCreatedHeading.waitFor({ state: "visible" });
    // 2. Core paragraph confirmation state check
    await this.page
      .locator("p")
      .filter({
        hasText:
          /Congratulations! Your new account has been successfully created!/i,
      })
      .first()
      .waitFor({ state: "visible" });
  }
}
