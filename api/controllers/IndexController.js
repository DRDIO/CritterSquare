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
            console.log(req.user);
            Passport.findOne({user: req.user.id}, function(err, passport) {
                var url = 'https://api.foursquare.com/v2/users/self/checkins?v=20140807&oauth_token=' + passport.tokens.accessToken;
                rest.get(url).on('complete', function(data) {
                   console.log(data.response.checkins.items);

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
