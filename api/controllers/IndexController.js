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
            User.findOne({id: req.user.id}, function(err, user) {
                console.log(req.user);
                console.log(err);
                console.log(user);
                return res.view('index/index', {
                    token: passport[0].tokens.accessToken,
                    user: req.user
                });
            });
        }
    }
};

module.exports = IndexController;
