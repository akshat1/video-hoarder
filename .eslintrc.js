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
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "comma-dangle": ["error", "always-multiline"],
    "import/default": "error",
    "import/extensions": ["error", "never"],
    "import/named": "error",
    "import/no-absolute-path": "error",
    "import/no-default-export": "error",
    "no-useless-escape": "off",
    "simple-import-sort/imports": ["error", { groups: [] }],
    quotes: ["error", "double"],
  },
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  env: {
    node: true,
    es6: true,
    browser: true,
    mocha: true,
    "jest/globals": true,
  },
};
