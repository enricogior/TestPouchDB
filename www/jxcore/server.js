'use strict';

var http = require('http');
var express = require('express');
var Promise = require('lie');
var expressPouchDb = require('express-pouchdb');
var utils = require('./utils');

var config = require('./config');

function Server() {
  this.app = express();

  this.app.use(config.DB_PATH, expressPouchDb(
      utils.getLevelDownPouchDb(),
      { mode: 'minimumForPouchDB' }
    ));

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
