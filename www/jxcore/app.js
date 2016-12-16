'use strict';

var Client = require('./client');
var Server = require('./server');
var PouchDB = require('pouchdb');
var levelDown = require('leveldown-mobile');
var Promise = require('lie');

var config = require('./config');
var utils = require('./utils');

var client = new Client(config.CONNECTION_TYPES.HTTP);
var server = new Server();

var CustomDb = PouchDB.defaults({
  db: levelDown,
  mode: 'minimumForPouchDB',
  prefix: 'db/'
});

var db = new CustomDb('http://localhost:3000/db/some');


server.init()
.then(function (port) {
  console.log('Express server is started. (port: ' + port + ')');
  return makePut(db);
})
.then(function () {
  return utils.callRow(makeGet, db, 50);
})
.then(function (times) {
  utils.logTime(times);
  return utils.callParallel(makeGet, db, 5);
})
.then(function (times) {
  utils.logTime(times);
  return utils.callParallel(makeGet, db, 10);
})
.then(function (times) {
  utils.logTime(times);
  return utils.callParallel(makeGet, db, 15);
})
.then(function (times) {
  utils.logTime(times);
  return process.exit();
})
.catch(function(e) {
  logger.fatal('EXIT with ' + JSON.stringify(e));
});

function makeGet (db) {
  return new Promise(function (resolve, reject) {
    var start = Date.now();
    db.get('new', function (err, result) {
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
      _id: 'new'
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
