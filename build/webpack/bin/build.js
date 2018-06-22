#!/usr/bin/env node

const createWebpackCompiler = require('../src');

build()//'//
  .catch(error => process.exit(error));

async function build() {
  const [entry] = process.argv.slice(2);
  const env = 'production';

  const compiler = createWebpackCompiler({
    entry,
    env,
    publicPath: 'dist/',
  });

  return new Promise((resolve, reject) => {
    compiler.run((error, stats) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stats);
    })
  });
}
