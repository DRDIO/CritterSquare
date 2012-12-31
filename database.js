// Cache db setup so it can be required from any API page
var mongodb = require('mongojs')
  , dbc
;

exports.init = function(config) {
    dbc = mongodb(config.url, config.collections);

    dbc.critter.ensureIndex({seed: 1}, {unique: true});
    dbc.user.ensureIndex({"fsid": 1},  {unique: true});
    dbc.user.ensureIndex({"token": 1}, {unique: true});
    
    return dbc;
}

exports.get = function() {
    return dbc;
}