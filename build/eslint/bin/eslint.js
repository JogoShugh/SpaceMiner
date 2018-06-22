#!/usr/bin/env node

const CLIEngine = require('eslint').CLIEngine;
const path = require('path');
const config = require('../src/index');

const cli = new CLIEngine(Object.assign({
  envs: ["browser", "node"],
  useEslintrc: false,
  ignorePath: path.join(__dirname, '..', 'src', '.eslintignore'),
},
  config,
));

const report = cli.executeOnFiles(process.argv.slice(2));
const formatter = cli.getFormatter("compact");

console.log(formatter(report.results));
