const React = require('react');

module.exports = {
  stories: ['../src/**/*.story.jsx'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-actions',
    '@storybook/addon-knobs',
    '@storybook/addon-links',
    '@storybook/addon-viewport',
  ],
  webpackFinal: async config => {
    config.module.rules = config.module.rules.filter(f => f.test.toString() !== /\.css$/.toString());
    config.module.rules.push({
      test: /\.less$/,
      exclude: /node_modules/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
            modules: { localIdentName: '[local]__[hash:base64:5]' },
          },
        },
        'less-loader'
      ]
    }, {
      test: /\.css$/,
      exclude: /node_modules/,
      use: [
        'style-loader',
        'css-loader'
      ]
    });

    return config;
  },
};
