// Cache db setup so it can be required from any API page
var mongodb = require('mongojs')
  , config  = require('./config/default.js');

module.exports = mongodb(config.mongodb.url, config.mongodb.collections);