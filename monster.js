var promise = require('q')
  , dbc     = require('./database')
  , prefix  = ['Dali', 'Pika', 'Laga', 'Sora', 'Jorn', 'Chax']
  , affix   = ['do', 're', 'me', 'fa', 'so', 'la', 'te']
  , suffix  = ['mon', 'digi', 'frag', 'kron', 'alba']
;

exports.random = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;    
}

exports.getName = function() {
    return prefix[exports.random(0, prefix.length - 1)]
        + suffix[exports.random(0, affix.length - 1)]
        + suffix[exports.random(0, suffix.length - 1)];
}

exports.getPower = function(checkinCount, userCount) {
    return Math.floor(10 * (1 - Math.exp(-userCount / 1000)));
}

exports.create = function(seed, type, checkinCount, userCount, venue, creator) {
    var deferred = promise.defer();
    
    var power = exports.getPower(checkinCount, userCount);
    
    dbc.critter.findOne({seed: seed}, function(err, row) {
        if (err) {
            deferred.reject(err);
            
        } else if (row) {
            dbc.critter.update({seed: seed}, {
                power: power
            });
            
            deferred.resolve(row);
            
        } else {
            row = {
                seed:  seed,
                name:  exports.getName(),
                venue: venue,
                type:  type.name,
                typeicon: (type.icon === undefined ? '' : type.icon.prefix + 'bg_32' + type.icon.suffix),
                body: {
                    head: exports.random(1, 5),
                    core: exports.random(1, 5),
                    back: exports.random(1, 5),
                    arms: exports.random(1, 5),
                    legs: exports.random(1, 5)
                },
                power: power,
                creator: creator
            };
            
            dbc.critter.insert(row, function(err, data) {
                row._id = data._id;
                deferred.resolve(row);    
            });
        }
    });
    
    return deferred.promise;
};