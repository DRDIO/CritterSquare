var async   = require('async')            // ASYNC used to load multiple sources and wait for all responses
  , db      = require('../database')
  , cats    = require('../categories')
  , monster = require('../monster')
;

exports.get = function(req, res, fsq) {
    // Check if logged in
    if (req.session.token) {
        // Perform parallel requests to get FSQ information
        async.parallel({
            // Get the user information
            user: function(callback) {
                fsq.Users.getUser('self', req.session.token, function(err, data) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, data.user);
                    }
                });
            },
            
            // Get all checkins
            checkins: function(callback) {
                fsq.Users.getVenueHistory(null, null, req.session.token, function(err, data) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, data.venues);
                    }
                });
            },
            
            // Get the user information
            badges: function(callback) {
                fsq.Users.getBadges(null, req.session.token, function(err, data) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, data.badges);
                    }
                });
            }
            
        }, function(err, data) {
            for (var i in data.checkins.items) {
                var venue = data.checkins.items[i].venue;
                for (var j in venue.categories) {
                    if (venue.categories[j].primary) {
                        venue.top = cats.findTop(cats.get(), venue.categories[j].id, true);
                        venue.monster = monster.create(venue.id, venue.top, venue.stats.checkinsCount, venue.stats.usersCount);
                    }
                }
            }
            
            res.utilrender(req, res, data);
        }); 
        
    } else {
        console.log('no session data');
        
        res.utilrender(req, res, {
            'title': 'Nothing'
        });
    }
};