import { MainApplicationBasePage } from "@facade/ui/page-object/automation-exercise/main-application-base.page";
import { Locator, Page, test } from "@playwright/test";
import { businessStep } from "@support/common/generic/business-function-messages";

export class DeleteAccountPage extends MainApplicationBasePage {
  readonly accountDeletedHeading: Locator;

  constructor(public page: Page) {
    super(page);
    this.accountDeletedHeading = this.page.getByTestId("account-deleted");
  }

  url(): string {
    return "/delete_account"; // Fixed path matching the actual domain routing
  }

  /**
   * Executes the final workflow step to route back to the landing dashboard.
   */
  async proceedToHomepage(): Promise<void> {
    await test.step(
      businessStep("Confirm destruction state and proceed to homepage"),
      async () => {
        await this.universalContinueButton.click();
      },
    );
  }

  /**
   * Verified child implementation for destruction state confirmation.
   */
  protected async pageLoaded(): Promise<void> {
    // 1. Structural heading check
    await this.accountDeletedHeading.waitFor({ state: "visible" });

    // 2. Core paragraph destruction state check
    await this.page
      .locator("p")
      .filter({
        hasText: /Your account has been permanently deleted!/i,
      })
      .first()
      .waitFor({ state: "visible" });
  }
}
