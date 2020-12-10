"use strict";

module.exports = {
    root: true,
    parser: "vue-eslint-parser",
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
    },
};
