import eslint from "@eslint/js";
import perfectionist from "eslint-plugin-perfectionist";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // 1. Apply core JavaScript and TypeScript recommended rules
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // 2. Configure import sorting and code structure
  {
    plugins: {
      perfectionist,
    },
    rules: {
      // Automatically sorts imports natively for TypeScript
      "perfectionist/sort-imports": [
        "error",
        {
          type: "natural",
          order: "asc",
          groups: [
            "builtin", // Node.js built-ins (e.g., path, fs)
            "external", // npm packages (e.g., @playwright/test)
            "internal", // Aliased paths if you use them
            "parent", // Relative imports (../)
            "sibling", // Relative imports (./)
            "index", // Index files (./index)
            "object", // Object-imports
            "unknown", // Anything else
          ],
          newlinesBetween: "always", // Adds a blank line between different groups
        },
      ],
    },
  },

  // 3. Ignore standard build artifacts and dependency folders
  {
    ignores: ["node_modules/", "dist/", "playwright-report/", "test-results/"],
  },
);
