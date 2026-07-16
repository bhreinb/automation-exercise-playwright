import { expect } from "@expectations/custom/generic/expect-extensions";
import { apiFixtures } from "@fixtures/api/automation-exercise/api.fixture";
import { uiPagesFixtures } from "@fixtures/ui/automation-exercise/pages.fixtures";
import type { OrchestrationTypes } from "@models/integration/orchestration.types";
import { test as base } from "@playwright/test";

const orchestrationFixtures = {
  ...apiFixtures,
  ...uiPagesFixtures,
};

export const test = base.extend<OrchestrationTypes>(orchestrationFixtures);

export { expect };
