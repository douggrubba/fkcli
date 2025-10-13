import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
    js.configs.recommended,
    {
        ignores: ["node_modules/", "dist/", "*.db", "*.log", ".git/"]
    },
    {
        files: ["**/*.{js,jsx}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            },
            globals: {
                console: "readonly",
                process: "readonly",
                Buffer: "readonly",
                __dirname: "readonly",
                __filename: "readonly",
                module: "readonly",
                require: "readonly",
                exports: "readonly",
                global: "readonly",
                setTimeout: "readonly",
                clearTimeout: "readonly",
                setInterval: "readonly",
                clearInterval: "readonly"
            }
        },
        plugins: {
            react,
            "react-hooks": reactHooks,
            prettier
        },
        rules: {
            ...react.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            "react/react-in-jsx-scope": "off", // Not needed with React 17+
            "react/prop-types": "off", // Since you're not using TypeScript prop validation
            "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            "no-console": "off", // Allow console logs for CLI apps
            "prettier/prettier": "error",
            "react-hooks/set-state-in-effect": "warn", // Allow for CLI apps where this pattern might be necessary

            // Disable ESLint formatting rules that conflict with Prettier
            indent: "off",
            quotes: "off",
            semi: "off",
            "comma-dangle": "off",
            "no-trailing-spaces": "off",
            "eol-last": "off",
            "max-len": "off",
            "object-curly-spacing": "off",
            "array-bracket-spacing": "off"
        },
        settings: {
            react: {
                version: "detect"
            }
        }
    },
    prettierConfig
];
