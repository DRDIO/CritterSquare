var async   = require('async')     // ASYNC used to load multiple sources and wait for all responses
  , promise = require('q')
  , fsq     = require('./service/foursquare').get()
  , cats    = require('./category')
  , monster = require('./object/monster')
  , user    = require('./object/user')

// Pull the latest info from foursquare and update database for a user (based on 4sq token)
exports.pull = function(token, callback) {
    // Perform parallel requests to get FSQ information
    async.parallel({
        // Get the user information
        user: function(synccallback) { 
            fsq.Users.getUser('self', token, function(err, data) {
                if (err) {
                    synccallback(err);
                } else {
                    synccallback(null, data.user);
                }
            });
        },
        
        // Get all checkins
        checkins: function(synccallback) {
            fsq.Users.getVenueHistory(null, null, token, function(err, data) {
                if (err) {
                    synccallback(err);
                } else {
                    synccallback(null, data.venues);
                }
            });
        },
        
    }, function(err, data) {
        var promises = [];
        
        // Update user information in database
        user.updateCurrent(data.user.id, token, data.user.firstName + ' ' + data.user.lastName);
            
        // Search through checkins and stores as critters    
        for (var i in data.checkins.items) {
            var venue = data.checkins.items[i].venue;
            for (var j in venue.categories) {
                if (venue.categories[j].primary) {
                    venue.top = cats.findTop(cats.get(), venue.categories[j].id, true);
                    promises.push(monster.create(
                        venue.id, 
                        venue.top, 
                        venue.stats.checkinsCount, 
                        venue.stats.usersCount,
                        venue.name,
                        data.user.firstName + ' ' + data.user.lastName
                    ));
                }
            }
        }

        data.monsters = [];
        
        // Wait until everything is created then update user table
        promise.allResolved(promises).then(function(promises) {
            promises.forEach(function(row) {
                if (row.isFulfilled()) {
                    data.monsters.push(row.valueOf()._id);
                } else {
                    console.log(row.valueOf().exception);
                }
            });
            
            console.log(token);
            
            user.setMonsters(token, data.monsters);
            
            callback(null, data);
        });
    }); 
};
