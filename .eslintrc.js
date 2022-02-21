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
    extends: ["plugin:vue/essential", "prettier"],
    plugins: ["vue", "prettier"],
    rules: {
        "prettier/prettier": "error",
        curly: ["error", "all"],
        "no-confusing-arrow": ["error", { allowParens: false }],
    },
};
