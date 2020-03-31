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
  ],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jsx-control-statements/recommended"
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
    "react/jsx-no-undef": [2, { allowGlobals: true }],
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error",
  }
};
