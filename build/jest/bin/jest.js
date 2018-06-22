#!/usr/bin/env node

const jest = require('jest-cli');
const path = require('path');

jest.runCLI({
  config: require.resolve('./../jest.config.js'),
}, [process.cwd()]);
