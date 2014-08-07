var rest = require('restler');

/**
 * Authentication Controller
 *
 * This is merely meant as an example of how your Authentication controller
 * should look. It currently includes the minimum amount of functionality for
 * the basics of Passport.js to work.
 */
var IndexController = {
    index: function (req, res) {
        if (!req.user) {
            res.redirect('/login');
        } else {
            Passport.findOne({user: req.user.id}, function(err, passport) {
                var url = 'https://api.foursquare.com/v2/users/self/checkins?v=20140807&offset=0&limit=500&afterTimestamp=0&oauth_token=' + passport.tokens.accessToken;
                rest.get(url).on('complete', function(data) {
                    console.log(data.response.checkins.count);
                   data.response.checkins.items.forEach(function(checkin) {

                        Venue.create({
                            key: checkin.venue.id,
                            name: checkin.venue.name,
                            lat: checkin.venue.location.lat,
                            lng: checkin.venue.location.lng,
                            power: checkin.venue.stats.usersCount,
                            category: checkin.venue.categories[0].name
                        }).exec(function(err, user) {
                            // console.log(err);
                        });
                   });

                    return res.view('index/index', {
                        token: passport.tokens.accessToken,
                        user: req.user
                    });
                });
            });
        }
    }
};

module.exports = IndexController;
