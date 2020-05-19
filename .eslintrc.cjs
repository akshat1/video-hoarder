module.exports = {
  parserOptions: {
    sourceType: "module",
    ecmaVersion: '2020',
    ecmaFeatures: {
      jsx: true,
    }
  },
  plugins: [
    "node",
    "react",
    "jsx-control-statements",
    "jest",
    "import",
  ],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jsx-control-statements/recommended",
    "plugin:import/errors"
  ],
  env: {
    node: true,
    es6: true,
    mocha: true,
    browser: true,
    "jest/globals": true,
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    "quotes": ["error", "double"],  // because it's silly twisting ourselves into knots whenever we need to use an apostrophe (yes fine a single quote).
    "react/jsx-no-undef": [2, { allowGlobals: true }],
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error",
    "import/no-default-export": "error",  // default anonymous exports R bad. Disallow default exports for simplicity.
    "import/named": "error",
    "import/default": "error",
    "import/no-absolute-path": "error",
  },
  overrides: [{
    files: ["*.story.jsx", "*.jsx"],
    "rules": {
      // 1. storybook depends on default exports
      // 2. A common react-redux pattern is to export the unconnected component as a named export (for testing), and
      //    the connected component as the default export. When the component is not connected, then no named export
      //    is provided and the unconnected component is the default export.
      "import/no-default-export": "off",
      "import/prefer-default-export": "error",
    }
  }]
};
