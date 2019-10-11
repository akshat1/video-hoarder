module.exports = {
  parserOptions: {
    ecmaVersion: 8,
    sourceType: "module",
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  },
  plugins: ["node"],
  env: {
    node: true,
    es6: true,
    mocha: true
  },
  extends: "eslint:recommended",
  rules: {
    "comma-dangle": "error",
    "comma-spacing": "error",
    "eol-last": "error",
    "function-call-argument-newline": ["error", "never"],
    "max-len": ["error", { "code": 120, "ignoreTrailingComments": true, "ignoreStrings": true, "ignoreUrls": true }],
    "max-params": ["error", 3],
    "max-statements-per-line": ["error"],
    "new-parens": "error",
    "newline-per-chained-call": "error",
    "no-alert": "error",
    "no-eval": "error",
    "no-fallthrough": "error",
    "no-return-await": "error",
    "no-throw-literal": "error",
    "no-unmodified-loop-condition": "error",
    "node/no-missing-require": "error",
    "prefer-promise-reject-errors": "error",
    "sort-imports": ["error", { "ignoreCase": true }],
    "valid-jsdoc": ["off", { "requireReturn": false }],
    curly: ["error", "multi"],
    eqeqeq: "error",
    indent: ["error", 2]
  }
};
