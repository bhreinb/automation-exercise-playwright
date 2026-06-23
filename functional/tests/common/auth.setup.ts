import { test as setup } from "@playwright/test";

setup("Accept all cookies globally", async ({ page }) => {
  await page.goto("/");

  const acceptButton = page.getByRole("button", {
    name: /accept all|agree|allow cookies|Consent/i,
  });

  if (await acceptButton.isVisible()) {
    await acceptButton.click();
  }

  await page.context().storageState({ path: ".auth/user.json" });
});
