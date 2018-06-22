const raf = require('raf-stub');

raf.replaceRaf([global, typeof window !== 'undefined' ? window : {}]);
