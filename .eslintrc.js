"use strict";

module.exports = {
    root: true,
    parser: "vue-eslint-parser",
    parserOptions: {
        sourceType: "module",
        parser: "@babel/eslint-parser",
    },
    env: {
        browser: true,
    },
    extends: ["plugin:vue/essential", "prettier"],
    plugins: ["vue", "prettier"],
    rules: {
        "prettier/prettier": [
            "error",
            {
                endOfLine: "auto",
            },
        ],
        "vue/multi-word-component-names": "warn",
        curly: ["error", "all"],
        "no-confusing-arrow": ["error", { allowParens: false }],
    },
};
