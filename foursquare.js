var foursquare  = require('node-foursquare-2')
  , config      = require('./config/default.js')
  , token       = ''
;

var fsq = foursquare(config.foursquare);

fsq.setToken = function(sessionToken) {
    token = sessionToken;
}

fsq.getToken = function() {
    return token;
}

module.exports = fsq;