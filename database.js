// Cache db setup so it can be required from any API page
var mongodb = require('mongojs')
  , config  = require('./config/default')
  , dbc     = mongodb(config.mongodb.url, config.mongodb.collections)
;

dbc.critter.ensureIndex({seed: 1}, {unique: true});

module.exports = dbc;