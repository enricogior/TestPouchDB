'use strict';

var http = require('http');
var express = require('express');
var Promise = require('lie');
var PouchDB = require('pouchdb');
var levelDown = require('leveldown-mobile');
var expressPouchDb = require('express-pouchdb');

var config = require('./config');

function Server() {
  this.app = express();

  var CustomDb = PouchDB.defaults({
    db: levelDown,
    mode: 'minimumForPouchDB',
    prefix: 'db/'
  });

  this.app.use(config.DB_PATH, expressPouchDb(CustomDb));

  var db = new CustomDb('some');

  return this;
}

Server.prototype.init = function () {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.server = http.createServer(self.app)
    .listen(config.PORT, function(err) {
      if (err) {
        return reject(err);
      }
      return resolve(config.PORT);
    });
  });
};

Server.prototype.stop = function () {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.server.close(function (err) {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
};

Server.prototype.reload = function () {
  var self = this;
  return self.stop()
  .then(function () {
    return self.init();
  })
  .catch(function (err) {
    return err;
  });
};

module.exports = Server;
