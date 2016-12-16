'use strict';

var http = require('http');
var https = require('https');
var Buffer = require('buffer').Buffer;
var Promise = require('lie');

var config = require('./config');

function Client (type) {
  this.type = (type === 'http') ? http : https;
  this.options = {
    hostname: config.HOSTNAME,
    port: config.PORT,
    path: config.DB_PATH
  };
  return this;
}

Client.prototype.get = function (data) {
  var options = this.options;
  var sendData = data || config.TEST_DATA;
  options.method = config.METHODS.GET;

  return _sendRequest(this.type, options, sendData);
};

Client.prototype.post = function (data) {
  var options = this.options;
  var sendData = data || config.TEST_DATA;
  options.method = config.METHODS.POST;
  options.headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(sendData)
  };

  return _sendRequest(this.type, options, sendData);
};

function _sendRequest (type, options, data) {
  return new Promise(function (resolve, reject) {
    var req = type.request(options, function(res) {
      resolve(Date.now() - start);
    });

    req.on('error', function (e) {
      reject(e);
    });

    req.write(data);

    var start = Date.now();
    req.end();
  });

}

module.exports = Client;
