module.exports = {
  extends: [
    "plugin:react/recommended",
    "plugin:jsx-control-statements/recommended"
  ],
  plugins: ["react", "jsx-control-statements"],
  env: {
    es6: true,
    browser: true
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    "react/prop-types": "off",
    "no-undef": 0,
    "react/jsx-no-undef": [2, { "allowGlobals": true }]
  }
};
