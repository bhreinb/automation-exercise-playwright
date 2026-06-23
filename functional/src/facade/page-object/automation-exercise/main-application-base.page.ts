import { HeaderComponent } from "@facade/components/automation-exercise/header.component";
import { BasePage } from "@facade/page-object/generic/base.page";
import { Locator, Page } from "@playwright/test";

export abstract class MainApplicationBasePage extends BasePage {
  readonly header: HeaderComponent;
  protected readonly universalContinueButton: Locator;

  protected constructor(public page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.universalContinueButton = this.page.getByTestId("continue-button");
  }
}
