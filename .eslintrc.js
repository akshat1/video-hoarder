module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
    "import",
    "simple-import-sort",
    "jest",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    "comma-dangle": ["error", "always-multiline"],
    "import/default": "error",
    "import/extensions": ["error", "never"],
    "import/named": "error",
    "import/no-absolute-path": "error",
    "import/no-default-export": "error",
    "simple-import-sort/imports": ["error", { groups: [] }],
    quotes: ["error", "double"],
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-types": "off",
  },
  env: {
    node: true,
    es6: true,
    browser: true,
    mocha: true,
    "jest/globals": true,
  },
};
