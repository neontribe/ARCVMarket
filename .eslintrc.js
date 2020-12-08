"use strict";

module.exports = {
    root: true,
    parserOptions: {
        sourceType: "module",
        parser: "babel-eslint",
    },
    env: {
        browser: true,
    },
    extends: ["prettier", "prettier/standard", "plugin:vue/essential"],
    plugins: ["vue", "prettier"],
    rules: {
        "prettier/prettier": "error",
        curly: ["error", "all"],
        "no-confusing-arrow": ["error", { allowParens: false }],
        "vue/html-self-closing": ["error", { html: { void: "any" } }],
    },
};
