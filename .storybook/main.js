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
    config.resolve.extensions.push('.tsx');
    config.resolve.extensions.push('.ts');
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      loader: require.resolve('babel-loader'),
      options: {
        presets: [
          '@babel/preset-env',
          '@babel/preset-react',
          '@babel/preset-typescript'
        ]
      }
    });

    return config;
  },
};
