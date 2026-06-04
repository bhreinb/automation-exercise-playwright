import { test as setup } from "@playwright/test";

setup("Accept all cookies globally", async ({ page }) => {
  await page.goto("/");

  // Use a flexible locator to find and click the accept button
  const acceptButton = page.getByRole("button", {
    name: /accept all|agree|allow cookies|Consent/i,
  });

  if (await acceptButton.isVisible()) {
    await acceptButton.click();
  }

  // Save the clean state to a file
  await page.context().storageState({ path: ".auth/user.json" });
});
