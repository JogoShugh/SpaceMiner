const webpack = require('webpack');
const createConfig = require('./createConfig');

module.exports = (
  {
    entry,
    env = 'development',
    cwd = process.cwd(),
    publicPath,
  },
) => webpack(createConfig({ entry, env, cwd, publicPath }));
