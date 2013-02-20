var promise  = require('q')
  , database = require('../service/database')
  , dbc      = database.get()
  , prefix   = ['Dali', 'Pika', 'Laga', 'Sora', 'Jorn', 'Chax']
  , affix    = ['do', 're', 'me', 'fa', 'so', 'la', 'te']
  , suffix   = ['mon', 'digi', 'frag', 'kron', 'alba']
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
            if (row.power != power) {
                console.log('UPDATING ' + row.name);

                dbc.critter.update({seed: seed}, {
                    $set: {
                        power: power
                    }
                });
            }

            deferred.resolve(row);
            
        } else {
            row = {
                _id:   database.getId(),
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

            console.log('INSERT ' + row.name);
            
            dbc.critter.insert(row);
            deferred.resolve(row);
        }
    });
    
    return deferred.promise;
};
