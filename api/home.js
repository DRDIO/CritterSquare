var async   = require('async')     // ASYNC used to load multiple sources and wait for all responses
  , promise = require('q')
  , db      = require('../database')
  , cats    = require('../categories')
  , monster = require('../monster')
  , user    = require('../user')
  , fsq     = require('../foursquare')
;

exports.get = function(req, res) {
    // Check if logged in
    if (req.session.token) {
        // Perform parallel requests to get FSQ information
        async.parallel({
            // Get the user information
            user: function(callback) { 
                user.get(callback);
            },
            
            // Get all checkins
            checkins: function(callback) {
                user.getCheckins(callback);
            },
            
        }, function(err, data) {
            var promises = [];
            
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
            
            promise.allResolved(promises).then(function (promises) {
                promises.forEach(function (row) {
                    if (row.isFulfilled()) {
                        data.monsters.push(row.valueOf());
                    } else {
                        console.log(row.valueOf().exception);
                    }
                });
                
                user.setMonsters(data.monsters);
                
                res.utilrender(req, res, data);
            });
        }); 
        
    } else {
        console.log('no session data');
        
        res.utilrender(req, res, {
            'title': 'Nothing'
        });
    }
};