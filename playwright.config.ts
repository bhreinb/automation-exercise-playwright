import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./functional/tests",
  timeout: 30000,
  retries: 1,
  // Use an explicit path so Playwright can load the teardown module reliably
  // Use the TypeScript teardown module.
  globalTeardown: "./functional/src/support/common/generic/global-teardown.ts",

  use: {
    headless: !!process.env.CI,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "retain-on-failure",
    // Use only for local debugging (records all tests).
    // Avoid in CI due to performance and storage impact.
    // video: 'on',
    viewport: null, // Max size window: Do not force a fixed viewport; use the browser window size instead
    launchOptions: {
      // Max size window
      args: ["--start-maximized"],
      slowMo: 800, // in milliseconds; slows down each action to better visualize interactions (useful for debugging, but increases test execution time)
    },
    baseURL: "https://automationexercise.com",
    testIdAttribute: "data-qa",
  },

  projects: [
    // UI setup project runs only alongside UI tests
    {
      name: "setup",
      testMatch: /common\/.*\.auth\.setup\.ts$|common\/.*\.setup\.ts$/,
    },
    // UI & Integration tests consume the saved storage state
    {
      name: "ui",
      testMatch: /ui\/.*\.spec\.ts/, // targets only the ui folder
      testIgnore: /.*\.setup\.ts$/,
      use: {
        browserName: "chromium",
        storageState: ".auth/user.json", // Automatically injects cookies/storage
      },
      dependencies: ["setup"],
    },
    {
      name: "integration",
      testMatch: /integration\/.*\.spec\.ts/, // targets only the integration folder
      testIgnore: /.*\.setup\.ts$/,
      use: {
        browserName: "chromium",
        storageState: ".auth/user.json", // Automatically injects cookies/storage
      },
      dependencies: ["setup"],
    },
    // API tests run without a browser and without setup dependency
    {
      name: "api",
      testMatch: /api\/.*\.spec\.ts/, // targets only the api folder
    },
  ],

  reporter: [
    ["html", { open: "never" }],
    ["junit", { outputFile: "results.xml" }],
    ["list"],
    ["allure-playwright", { detail: true, outputFolder: "allure-results" }],
  ],
});
