import { HeaderComponent } from "@facade/ui/components/automation-exercise/header.component";
import { BasePage } from "@facade/ui/page-object/generic/base.page";
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
