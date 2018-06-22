require('./setupRaf');
require('./setupEnzyme');
const jestWhen = require('jest-when');

global.when = jestWhen.when;
