import { Locator, Page } from "@playwright/test";
import { HeaderPage } from "./header.page";

export class SignupPage extends HeaderPage {
  // Account info
  readonly titleMr: Locator;
  readonly titleMrs: Locator;
  readonly name: Locator;
  readonly email: Locator;
  readonly password: Locator;
  // Personal/address info
  readonly daySelect: Locator;
  readonly monthSelect: Locator;
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
  // Submit
  readonly createAccount: Locator;

  constructor(public page: Page) {
    super(page);
    // Title radios (data-qa="title" is on the wrapper div; the input has name="title" + value)
    this.titleMr = this.page.locator('input[name="title"][value="Mr"]');
    this.titleMrs = this.page.locator('input[name="title"][value="Mrs"]');
    // Form fields (data-qa-backed)
    this.name = this.page.locator('input[data-qa="name"]');
    this.email = this.page.locator('input[data-qa="email"]');
    this.password = this.page.locator('input[data-qa="password"]');
    // Date of birth selects
    this.daySelect = this.page.locator('select[data-qa="days"]');
    this.monthSelect = this.page.locator('select[data-qa="months"]');
    this.yearSelect = this.page.locator('select[data-qa="years"]');
    // Address block
    this.firstName = this.page.locator('input[data-qa="first_name"]');
    this.lastName = this.page.locator('input[data-qa="last_name"]');
    this.company = this.page.locator('input[data-qa="company"]');
    // In markup: data-qa="address" is on the street address input (name="address1")
    this.address = this.page.locator('input[data-qa="address"]');
    this.address2 = this.page.locator('input[data-qa="address2"]');
    this.countrySelect = this.page.locator('select[data-qa="country"]');
    this.state = this.page.locator('input[data-qa="state"]');
    this.city = this.page.locator('input[data-qa="city"]');
    this.zipcode = this.page.locator('input[data-qa="zipcode"]');
    this.mobileNumber = this.page.locator('input[data-qa="mobile_number"]');
    // Submit
    this.createAccount = this.page.locator('button[data-qa="create-account"]');
  }

  async pageLoaded(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
    // Page title
    const title = await this.page.title();
    if (!/Automation Exercise - Signup/i.test(title)) {
      throw new Error(`Unexpected page title: ${title}`);
    }
    // Heading: "ENTER ACCOUNT INFORMATION"
    const heading = this.page
      .getByRole("heading")
      .filter({ hasText: /enter account information/i });
    await heading.first().waitFor({ state: "visible" });
    const headingText = (await heading.first().textContent())?.trim();
    if (!/enter account information/i.test(headingText ?? "")) {
      throw new Error(
        `Unexpected heading: ${headingText ?? "<empty>"} (expected: Enter Account Information)`,
      );
    }
  }

  url(): string {
    return "/signup";
  }

  async setTitle(title: "Mr" | "Mrs") {
    if (title === "Mr") {
      await this.titleMr.check();
      return;
    }
    await this.titleMrs.check();
  }

  async setPassword(password: string) {
    await this.password.fill(password);
  }

  async setDay(day: number) {
    await this.daySelect.selectOption(String(day));
  }

  async setMonth(month: number | string) {
    const monthIndex = typeof month === "string" ? parseInt(month, 10) : month;
    // Map "01" -> "January", ..., "12" -> "December"
    const monthLabelByIndex: Record<number, string> = {
      1: "January",
      2: "February",
      3: "March",
      4: "April",
      5: "May",
      6: "June",
      7: "July",
      8: "August",
      9: "September",
      10: "October",
      11: "November",
      12: "December",
    };
    const label = monthLabelByIndex[monthIndex];
    if (!label) {
      throw new Error(`Invalid month: ${month} (expected 01-12 or 1-12)`);
    }
    await this.monthSelect.selectOption({ label });
  }

  async setYear(year: number) {
    await this.yearSelect.selectOption(String(year));
  }

  async setFirstName(firstName: string) {
    await this.firstName.fill(firstName);
  }

  async setLastName(lastName: string) {
    await this.lastName.fill(lastName);
  }

  async setCompany(company: string) {
    await this.company.fill(company);
  }

  async setAddress(address: string) {
    await this.address.fill(address);
  }

  async setAddress2(address2: string) {
    await this.address2.fill(address2);
  }

  async setCountry(country: string) {
    await this.countrySelect.selectOption({ value: country });
  }

  async setState(state: string) {
    await this.state.fill(state);
  }

  async setCity(city: string) {
    await this.city.fill(city);
  }

  async setZipcode(zipcode: number) {
    await this.zipcode.fill(String(zipcode));
  }

  async setMobileNumber(mobileNumber: number) {
    await this.mobileNumber.fill(String(mobileNumber));
  }

  async submitCreateAccount() {
    await this.createAccount.click();
  }
}
