import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e/tests",
  timeout: 30000,
  retries: 1,

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
  },

  projects: [
    // UI setup project runs only alongside UI tests
    {
      name: "setup",
      testDir: "./e2e/tests/ui",
      testMatch: /.*\.setup\.ts$/,
    },
    // UI tests consume the saved storage state
    {
      name: "chromium",
      testDir: "./e2e/tests/ui",
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
      testDir: "./e2e/tests/api",
    },
  ],

  reporter: [
    ["html", { open: "never" }],
    ["junit", { outputFile: "results.xml" }],
    ["list"],
    ["allure-playwright", { detail: true, outputFolder: "allure-results" }],
  ],
});
