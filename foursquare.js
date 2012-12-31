var foursquare  = require('node-foursquare-2')
  , fsq
;

exports.init = function(config) {
    fsq = foursquare(config);
    return fsq;
}

exports.get = function() {
    return fsq;
}