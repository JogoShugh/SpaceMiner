const os = require('os');
const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (
  {
    entry,
    publicPath,
    host = '0.0.0.0',
    port = 80,
    env = 'development',
    cwd = process.cwd(),
    noMinimize = false,
    report = false,
  },
) => ({
  mode: env,
  entry: {
    main:
      env === 'development'
        ? [
          'react-hot-loader/patch',
          `webpack-hot-middleware/client`,
          path.join(process.cwd(), entry),
        ]
        : path.join(cwd, entry),
    vendor: [
      'react',
      'react-dom',
      'react-router',
      'react-router-dom',
    ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(cwd, 'dist'),
    publicPath: publicPath,
    library: 'App',
    libraryTarget: "umd",

  },
  devtool: env === 'production' ? false : 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.md$/,
        exclude: /node_modules/,
        loader: 'raw-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: require.resolve('babel-loader'),
        options: {
          cacheDirectory: true,
        },
      },
      {
        test: /\.(gif|jpe?g|png|ico)$/,
        loader: 'url-loader?limit=10000',
      },
    ],
  },
  resolve: {
    mainFields: ['pkg:main', 'main'],
    extensions: ['.js'],
  },
  plugins: plugins({ cwd, env, noMinimize, report }),
});
function plugins(
  {
    cwd,
    env,
    noMinimize,
    report,
  },
) {
  const plugins = [
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': `"${env}"`,
    }),
    new CopyWebpackPlugin([
      { from: path.join(process.cwd(), '..', '**', 'assets/**/*'), to: path.join(process.cwd(), 'dist', 'assets'), flatten: true, },
    ], {
        debug: env === 'development',
      }),
  ];

  if (report) {
    plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: true,
        generateStatsFile: true,
        logLevel: 'error',
      }),
    );
  }

  if (env === 'development') {
    plugins.push(new webpack.HotModuleReplacementPlugin());
    plugins.push(new webpack.NoEmitOnErrorsPlugin());
  }

  if (env === 'production' && !noMinimize) {
    plugins.push(uglify());
  }

  return plugins;
}

const uglify = () => {
  return new UglifyJsPlugin({
    parallel: Math.max(os.cpus().length - 1, 1),
    uglifyOptions: {
      compress: {
        arrows: false,
        booleans: false,
        collapse_vars: false,
        comparisons: false,
        computed_props: false,
        hoist_funs: false,
        hoist_props: false,
        hoist_vars: false,
        if_return: false,
        inline: false,
        join_vars: false,
        keep_infinity: true,
        loops: false,
        negate_iife: false,
        properties: false,
        reduce_funcs: false,
        reduce_vars: false,
        sequences: false,
        side_effects: false,
        switches: false,
        top_retain: false,
        toplevel: false,
        typeofs: false,
        unused: false,
        conditionals: true,
        dead_code: true,
        evaluate: true,
      },
      mangle: true,
    },
  });
};
