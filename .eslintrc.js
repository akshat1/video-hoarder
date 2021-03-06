module.exports = {
  parser: "@typescript-eslint/parser",
  // parserOptions: {
  //   sourceType: "module",
  //   ecmaVersion: '2020',
  //   ecmaFeatures: {
  //     jsx: true,
  //   }
  // },
  plugins: [
    "node",
    "react",
    "jsx-control-statements",
    "jest",
    "import",
    "simple-import-sort",
    "sort-destructure-keys",
    "@typescript-eslint",
  ],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jsx-control-statements/recommended",
    "plugin:import/errors",
    "plugin:react-hooks/recommended",
  ],
  env: {
    node: true,
    es6: true,
    mocha: true,
    browser: true,
    "jest/globals": true,
  },
  settings: {
    react: { version: "detect" },
    "import/resolver": {
      node: {
        extensions: [".js", ".ts", ".jsx", ".tsx"]
      }
    },
  },
  rules: {
    "comma-dangle": ["error", "always-multiline"],
    "import/default": "error",
    "import/extensions": ["error", "never"],
    "import/named": "error",
    "import/no-absolute-path": "error",
    "import/no-default-export": "error",  // default anonymous exports R bad. Disallow default exports for simplicity.
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error",
    "react/jsx-closing-bracket-location": "error",
    "react/jsx-closing-tag-location": "error",
    "react/jsx-first-prop-new-line": ["error", "multiline-multiprop"],
    "react/jsx-indent-props": ["error", 2],
    "react/jsx-max-props-per-line": ["error", { "maximum": 1, "when": "always" }],
    "react/jsx-no-undef": [2, { allowGlobals: true }],
    "react/jsx-sort-props": "error",
    "react/jsx-wrap-multilines": ["error", { arrow: "parens", declaration: "parens-new-line" }],
    "react/prop-types": "off",  // need to figure out how to move to tsx without having to worry about missing type def files for jsx-conditionals.
    "simple-import-sort/sort": ["error", { groups: [] }],
    "sort-destructure-keys/sort-destructure-keys": "error",
    quotes: ["error", "double"],  // because it's silly twisting ourselves into knots whenever we need to use an apostrophe (yes fine a single quote).
  },
  overrides: [{
    files: ["*.jsx", "*.tsx"],
    "rules": {
      // 1. storybook depends on default exports
      // 2. A common react-redux pattern is to export the unconnected component as a named export (for testing), and
      //    the connected component as the default export. When the component is not connected, then no named export
      //    is provided and the unconnected component is the default export.
      "import/no-default-export": "off",
      "import/prefer-default-export": "error",
    }
  }, {
    files: ["*.tsx", "*.ts"],
    extends: ["plugin:@typescript-eslint/recommended"],
    rules: {
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/triple-slash-reference": "off",
      "jsx-control-statements/jsx-jcs-no-undef": "off",  // reports SocketIOClient as undefined 🤦‍♂️
    }
  }]
};
