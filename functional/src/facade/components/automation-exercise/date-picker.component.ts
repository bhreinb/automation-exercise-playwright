import { Locator } from "@playwright/test";

export class DatePickerComponent {
  private readonly monthSelect: Locator;

  // The parent page injects the specific month selector locator here
  constructor(monthSelectLocator: Locator) {
    this.monthSelect = monthSelectLocator;
  }

  async setMonth(month: number | string) {
    const monthIndex = typeof month === "string" ? parseInt(month, 10) : month;
    if (isNaN(monthIndex) || monthIndex < 1 || monthIndex > 12) {
      throw new Error(`Invalid month: "${month}". Expected 1-12.`);
    }
    const label = new Intl.DateTimeFormat("en", { month: "long" }).format(
      new Date(2000, monthIndex - 1),
    );
    await this.monthSelect.selectOption({ label });
  }
}
