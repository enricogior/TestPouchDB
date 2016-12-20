'use strict';

var Buffer = require('buffer').Buffer;

module.exports = {
  HOSTNAME: 'localhost',
  PORT: 3000,
  PROTOCOL: 'http',
  PATH: '/',
  DB_PATH: '/db',
  CONNECTION_TYPES: {
    HTTP: 'http',
    HTTPS: 'https'
  },
  METHODS: {
    GET: 'GET',
    POST: 'POST'
  },
  TEST_DATA: 'Hello tester',
  SUPPORTED_PSK_CIPHERS: 'PSK-AES256-CBC-SHA',
  PSK_ID: 'yo ho ho',
  PSK_KEY: new Buffer('Nothing going on here')
};
