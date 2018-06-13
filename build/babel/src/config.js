module.exports = {
  presets: [
    'babel-preset-env',
    'babel-preset-react',
  ],
  plugins: [
    'babel-plugin-dynamic-import-webpack',
    'babel-plugin-transform-class-properties',
    'babel-plugin-transform-object-rest-spread',
    'babel-plugin-emotion',
  ],
  env: {
    development: {
      plugins: [
        'babel-plugin-react-hot-loader/babel',
      ],
    },
  },
};
