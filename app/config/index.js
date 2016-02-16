'use strict';

var path = require('path');
var nconf = require('nconf');

nconf.file({
  file: path.join(__dirname, '/../../settings.json')
});

// this is the object that you want to override in your own local config
nconf.defaults({
  env: process.env.NODE_ENV || 'development',
  debug: process.env.DEBUG || false,
  app: {
    port: process.env.PORT || 5000
  },
  conductor: {
    url: process.env.OS_CONDUCTOR || 'http://s145.okserver.org',
    pollInterval: process.env.POLL_INTERVAL || 3000
  },
  basePath: process.env.OS_PACKAGER_BASE_PATH || ''
});

module.exports = {
  get: nconf.get.bind(nconf),
  set: nconf.set.bind(nconf),
  reset: nconf.reset.bind(nconf)
};
