'use strict';

var inherits     = require('inherits');
var extend       = require('js-extend').extend;

function PouchDBGenerator(PouchDB, defaultDirectory, options) {

  function PouchAlt(name, opts, callback) {
    if (!(this instanceof PouchAlt)) {
      return new PouchAlt(name, opts, callback);
    }

    if (typeof opts === 'function' || typeof opts === 'undefined') {
      callback = opts;
      opts = {};
    }

    if (name && typeof name === 'object') {
      opts = name;
      name = undefined;
    }

    opts = extend({}, opts);

    // If database endpoint is not remote we will use defaultDirectory as
    // prefix and defaultAdapter as adapter for it.
    if (
      name !== undefined &&
      name.indexOf('http') !== 0 &&
      name.indexOf('https') !== 0
    ) {
      if (!opts.db && options.defaultAdapter) {
        opts.db = options.defaultAdapter;
      }
      if (!opts.prefix) {
        opts.prefix = defaultDirectory;
      }
    }

    PouchDB.call(this, name, opts, callback);
  }

  options = extend({}, options);

  inherits(PouchAlt, PouchDB);

  PouchAlt.preferredAdapters = PouchDB.preferredAdapters.slice();
  Object.keys(PouchDB).forEach(function (key) {
    if (!(key in PouchAlt) ) {
      PouchAlt[key] = PouchDB[key];
    }
  });

  return PouchAlt;
}

module.exports = PouchDBGenerator;
