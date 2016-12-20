'use strict';

var Server = require('./server');
var Promise = require('lie');
var utils = require('./utils');
var config = require('./config');
var ForeverAgent = require('forever-agent');

var server = new Server();
var serverUrl = config.PROTOCOL + '://' +
 config.HOSTNAME + ':' + config.PORT +
 config.DB_PATH + '/' + utils.getUniqueRandomName();
var db = new utils.getLevelDownPouchDb()(serverUrl, {
  ajax: {
    agent: new ForeverAgent({
      maxSockets: 100
    })
  }
});

var counter = 0;

server.init()
.then(function (port) {
  console.log('Express server is started. (port: ' + port + ')');
  return utils.callRow(makePut, db, 30);
})
.then(function (times) {
  counter = 0;
  utils.logTime(times, 'PUT');
  return Promise.all([utils.callParallel(makeGet, db, 4),
                      utils.callParallel(makePost, db, 1)]);
})
.then(function (times) {
  utils.logTime(times[0], 'GET');
  utils.logTime(times[1], 'POST');
  return Promise.all([utils.callParallel(makeGet, db, 7),
                      utils.callParallel(makePost, db, 3)]);
})
.then(function (times) {
  utils.logTime(times[0], 'GET');
  utils.logTime(times[1], 'POST');
  return Promise.all([utils.callParallel(makeGet, db, 9),
                      utils.callParallel(makePost, db, 6)]);
})
.then(function (times) {
  utils.logTime(times[0], 'GET');
  utils.logTime(times[1], 'POST');
  return;
})
.catch(function(e) {
  console.log('EXIT with ' + JSON.stringify(e));
});

function makeGet (db) {
  return new Promise(function (resolve, reject) {
    var start = Date.now();
    db.get('new' + counter++, function (err, result) {
      if(!err) {
        resolve(Date.now() - start);
      } else {
        reject(err);
      }
    });
  });
}

function makePut(db) {
  return new Promise(function (resolve, reject) {
    var start = Date.now();
    db.put({
      title: 'Some string',
      _id: 'new' + counter++
    }, function (err, result) {
      if(!err) {
        resolve(Date.now() - start);
      } else {
        reject(err);
      }
    });
  });
}

function makePost (db) {
  return new Promise(function (resolve, reject) {
    var start = Date.now();
    db.post({
      title: 'Some string'
    }, function (err, result) {
      if(!err) {
        resolve(Date.now() - start);
      } else {
        reject(err);
      }
    });
  });
}
