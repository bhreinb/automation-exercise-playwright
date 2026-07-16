import { Locator } from "@playwright/test";

/**
 * Formats clean, high-level business step descriptions for successful report timelines.
 */
export const businessStep = (message: string): string =>
  `Business Step: ${message}`;

/**
 * Formats detailed structural text wrappers for triage logs when an assertion fails.
 * Conditionally appends technical details headers only if extra context parameters are provided.
 */
export function businessFunctionTested(
  message: string,
  context?: string | Locator,
): string {
  const baseMessage = `Business Action: ${message}`;
  // 1. If nothing is passed, return the clean base message
  if (!context) {
    return baseMessage;
  }
  // 2. If a Playwright Locator is passed, automatically extract its string representation
  const technicalDetails =
    typeof context === "string" ? context : String(context);
  return `${baseMessage}\n\nTechnical Details: ${technicalDetails}`;
}
