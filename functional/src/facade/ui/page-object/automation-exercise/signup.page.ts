import { DatePickerComponent } from "@facade/ui/components/automation-exercise/date-picker.component";
import { MainApplicationBasePage } from "@facade/ui/page-object/automation-exercise/main-application-base.page";
import type { AutomationUser } from "@models/common/automation-exercise/login.types";
import { Locator, Page, test } from "@playwright/test";
import { businessStep } from "@support/common/generic/business-function-messages";

export class SignupPage extends MainApplicationBasePage {
  readonly datePickerComponent: DatePickerComponent;
  readonly title: (title: "Mr" | "Mrs") => Locator;
  readonly name: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly daySelect: Locator;
  readonly yearSelect: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly company: Locator;
  readonly address: Locator;
  readonly address2: Locator;
  readonly countrySelect: Locator;
  readonly state: Locator;
  readonly city: Locator;
  readonly zipcode: Locator;
  readonly mobileNumber: Locator;
  readonly createAccount: Locator;

  constructor(public page: Page) {
    super(page);
    this.datePickerComponent = new DatePickerComponent(
      this.page.getByTestId("months"),
    );
    this.title = (title) =>
      this.page.getByTestId("title").locator(`input[value="${title}"]`);
    this.name = this.page.getByTestId("name");
    this.email = this.page.getByTestId("email");
    this.password = this.page.getByTestId("password");
    this.daySelect = this.page.getByTestId("days");
    this.yearSelect = this.page.getByTestId("years");
    this.firstName = this.page.getByTestId("first_name");
    this.lastName = this.page.getByTestId("last_name");
    this.company = this.page.getByTestId("company");
    this.address = this.page.getByTestId("address");
    this.address2 = this.page.getByTestId("address2");
    this.countrySelect = this.page.getByTestId("country");
    this.state = this.page.getByTestId("state");
    this.city = this.page.getByTestId("city");
    this.zipcode = this.page.getByTestId("zipcode");
    this.mobileNumber = this.page.getByTestId("mobile_number");
    this.createAccount = this.page.getByTestId("create-account");
  }

  url(): string {
    return "/signup";
  }

  /**
   * Fills out the baseline security and user profile options block
   */
  async fillAccountInformation(user: AutomationUser): Promise<void> {
    await test.step(
      businessStep(
        "Populate profile authentication data and security configurations",
      ),
      async () => {
        await this.title(user.title).check();
        await this.password.fill(user.password);
        await this.daySelect.selectOption(String(user.birth_date));
        await this.datePickerComponent.setMonth(user.birth_month); // Elegant nested component interaction
        await this.yearSelect.selectOption(String(user.birth_year));
      },
    );
  }

  /**
   * Fills out the detailed address and geographic mapping block
   */
  async fillAddressInformation(user: AutomationUser): Promise<void> {
    await test.step(
      businessStep(
        "Populate physical address entries and contact communications data",
      ),
      async () => {
        await this.firstName.fill(user.firstname);
        await this.lastName.fill(user.lastname);
        await this.company.fill(user.company ?? "");
        await this.address.fill(user.address1);
        await this.address2.fill(user.address2 ? String(user.address2) : "");
        await this.countrySelect.selectOption({ value: user.country });
        await this.state.fill(user.state);
        await this.city.fill(user.city);
        await this.zipcode.fill(String(user.zipcode));
        await this.mobileNumber.fill(String(user.mobile_number));
      },
    );
  }

  /**
   * Submits the completely filled profile for persistence
   */
  async submitRegistrationForm(): Promise<void> {
    await test.step(
      businessStep("Submit registration form profile details"),
      async () => {
        await this.createAccount.click();
      },
    );
  }

  /**
   * Verified child implementation for complex details form readiness.
   */
  protected async pageLoaded(): Promise<void> {
    // 1. Quick page shell title check
    const title = await this.page.title();
    if (!/Automation Exercise - Signup/i.test(title)) {
      throw new Error(`Unexpected page title: ${title}`);
    }
    // 2. Form container and target button checks
    const heading = this.page
      .getByRole("heading")
      .filter({ hasText: /enter account information/i });
    await heading.first().waitFor({ state: "visible" });
    // 3. Exact semantic heading validation
    const headingText = (await heading.first().textContent())?.trim();
    if (!/enter account information/i.test(headingText ?? "")) {
      throw new Error(
        `Unexpected heading: ${headingText ?? "<empty>"} (expected: Enter Account Information)`,
      );
    }
  }
}
