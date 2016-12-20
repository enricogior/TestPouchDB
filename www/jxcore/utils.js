'use strict';

var Promise = require('lie');
var stats = require('stats-lite');
var os = require('os');
var path = require('path');
var tmp = require('tmp');
var platform = require('./platform');
var fs = require('fs-extra-promise');
var PouchDB = require('pouchdb');
var levelDown = require('leveldown-mobile');
var PouchDBGenerator = require('./pouchDBGenerator');

module.exports.callParallel = function (method, args, n) {
  console.log('Call ' + method.name + ' ' + n + ' times in parallel mode');
  var arr = makeArray(n).map(function () {
    return method(args);
  });
  return Promise.all(arr);
};

module.exports.callRow = function (method, args, n) {
  console.log('Call ' + method.name + ' ' + n + ' times in row mode');
  var times = [];
  var arr = makeArray(n).reduce(function (prev) {
    return prev.then(function (val) {
      if(val) {
        times.push(val);
      }
      return method(args);
    });
  }, Promise.resolve());

  return arr.then(function () {
    return times;
  });
};

module.exports.logTime = function (requestsTime, method) {
  console.log(method + ': ' + requestsTime.join('ms, ') + 'ms');
  console.log(method + ': ' + 'Average time: ' + stats.mean(requestsTime) + 'ms');
  console.log(method + ': ' + 'Median: ' + stats.median(requestsTime) + 'ms');
  console.log(method + ': ' + 'Standard deviation: ' + stats.stdev(requestsTime) + 'ms');
};

function makeArray(length) {
  return Array.apply(null, new Array(length));
}

var tmpObject = null;
function tmpDirectory () {
  if (platform._isRealMobile) {
    return os.tmpdir();
  }

  tmp.setGracefulCleanup();
  if (tmpObject === null) {
    tmpObject = tmp.dirSync({
      unsafeCleanup: true
    });
  }
  return tmpObject.name;
}

var getUniqueRandomName = function () {
  var time = process.hrtime();
  time = time[0] * Math.pow(10, 9) + time[1];
  return time.toString(36);
};
module.exports.getUniqueRandomName = getUniqueRandomName;

var pouchDBTestDirectory = path.join(tmpDirectory(), 'pouchdb-test-directory');
fs.ensureDirSync(pouchDBTestDirectory);
module.exports.getPouchDBTestDirectory = function () {
  return pouchDBTestDirectory;
};

var defaultDirectory = path.join(pouchDBTestDirectory, getUniqueRandomName());
fs.ensureDirSync(defaultDirectory);
module.exports.getDefaultDirectory = function () {
  return defaultDirectory;
};

function getLevelDownPouchDb() {
  var defaultDirectory = path.join(pouchDBTestDirectory, getUniqueRandomName());
  fs.ensureDirSync(defaultDirectory);
  return PouchDBGenerator(PouchDB, defaultDirectory, {
    defaultAdapter: levelDown
  });
}

module.exports.getLevelDownPouchDb = getLevelDownPouchDb;
