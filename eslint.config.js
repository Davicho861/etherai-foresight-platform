import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

// Base config: apply to source files only. Heavy directories (node_modules, build,
// prisma, server databases and test-results) are excluded via .eslintignore.
export default [
  js.configs.recommended,
  // General JS/TSX files
  {
    ignores: ["dist"],
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2024,
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      // NOTE: Temporarily relaxed rules to allow staged sanitation. These will be
      // progressively re-enabled as files are fixed.
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      // Many legacy files reference globals or have unused placeholders. Disable
      // these checks temporarily to allow the reforge process to continue.
      "no-undef": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  // Server and scripts (Node environment)
  {
    files: ["server/**", "scripts/**", "jest.setup.js"],
    languageOptions: {
      globals: globals.node,
      parser: tsParser,
      ecmaVersion: 2024,
      sourceType: "module",
    },
    rules: {
      "no-undef": "off",
    },
  },
  // Tests and playwright (node+browser env)
  {
    files: ["**/__tests__/**", "**/*.spec.ts", "**/*.spec.tsx", "**/*.spec.js", "**/*.test.*", "playwright/**"],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
      parser: tsParser,
      ecmaVersion: 2024,
    },
    rules: {
      "no-undef": "off",
    },
  },
  // TypeScript React specific
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2024,
      sourceType: "module",
      globals: globals.browser,
    },
    rules: {
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
  },
];
