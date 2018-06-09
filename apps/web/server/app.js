const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const Html = require('./Html');

const env = process.env.NODE_ENV;
const port = process.env.PORT;

const app = new express();
if (env === 'development') {
  const createWebpackCompiler = require('@space-miner/webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const publicPath = '/dist';
  const compiler = createWebpackCompiler({ cwd: __dirname, entry: path.join('client', 'index.js'), publicPath });
  app.use(webpackDevMiddleware(compiler, {
    publicPath,
  }));
  app.use(webpackHotMiddleware(compiler));
}

app.get('/dist/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', req.url));
});

app.use(bodyParser.json());

app.get('/*', (req, res) => {
  res.send(Html({ scripts: ['/dist/vendor.js', '/dist/main.js'] }))
});

app.listen(port, () => console.log(`App running on port ${port}`));
