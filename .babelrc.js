module.exports = {
  "presets": [
    "@babel/preset-typescript",
    [
      "@babel/preset-env",
      {
        "targets": {
          "chrome": 80,
          "node": "current"
        }
      }
    ]
  ],
  "plugins": [
    "@babel/plugin-proposal-optional-chaining",
    "lodash",
  ],
  "overrides": [{
    "test": /client\/.*(j|t)sx?/,
    "presets": [
      "@babel/preset-react"
    ],
    "plugins": [
      "jsx-control-statements"
    ]
  }]
};
