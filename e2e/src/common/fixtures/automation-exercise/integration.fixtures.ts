import { test as base, expect } from "@playwright/test";

import { apiFixtures } from "../../../api/fixtures/automation-exercise/api.fixture";
import { uiPagesFixtures } from "../../../ui/fixtures/automation-exercise/pages.fixtures";

export type IntegrationFixtures = typeof apiFixtures & typeof uiPagesFixtures;

export const test = base.extend<IntegrationFixtures>({
  ...apiFixtures,
  ...uiPagesFixtures,
});

export { expect };
