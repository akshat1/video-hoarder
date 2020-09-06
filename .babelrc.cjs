module.exports = {
  "presets": [
    "@babel/preset-typescript",
    [
      "@babel/preset-env",
      {
        "targets": {
          "chrome": 80,
          "esmodules": false
        },
        "modules": "false"
      }
    ]
  ],
  "plugins": [
    "@babel/plugin-proposal-optional-chaining"
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
