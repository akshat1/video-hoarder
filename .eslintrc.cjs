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
    "jsx-control-statements"
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
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    "react/jsx-no-undef": [2, { allowGlobals: true }],
  }
};
