import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import obsidianmd from "eslint-plugin-obsidianmd";
import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig([
	{
		ignores: ["**/node_modules/**", "**/dist/**", "**/build/**", "**/*.config.*", "*.js", "package.json"],
	},
	...obsidianmd.configs.recommended,
	{
		files: ["**/*.ts"],
		plugins: {
			"@typescript-eslint": tsPlugin,
			"obsidianmd": obsidianmd,
		},
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: ["tsconfig.json"],
			},
			globals: {
				...globals.browser,
				...globals.node,
			},
		},

		rules: {
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": ["error", { args: "none" }],
			"no-unused-labels": "off",
			"@typescript-eslint/ban-ts-comment": "off",
			"no-prototype-builtins": "off",
			"@typescript-eslint/no-empty-function": "off",
			"require-await": "error",
			"@typescript-eslint/require-await": "warn",
			"@typescript-eslint/no-misused-promises": "warn",
			"@typescript-eslint/no-floating-promises": "warn",
			"no-async-promise-executor": "warn",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-unnecessary-type-assertion": "error",
			"no-constant-condition": ["error", { checkLoops: false }],
			"obsidianmd/prefer-file-manager-trash-file": "error",
		},
	},
]);
