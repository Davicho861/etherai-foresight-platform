import globals from "globals";
import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "backend_stdout.log",
      "reports/**",
      "**/generated/**",
      ".wrangler/**",
      "server/coverage/**",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        ...globals.jest,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-prototype-builtins": "warn",
      "no-cond-assign": "warn",
      "no-useless-escape": "warn",
      "no-case-declarations": "warn",
      "no-empty": "warn",
      "no-undef": "off", // Temporalmente desactivado para la purga inicial
      "no-useless-catch": "warn",
      "no-duplicate-case": "warn"
    },
  },
];
