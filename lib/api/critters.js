var user    = require('../object/user')
;

exports.get = function(req, res) {
    if (req.session.token !== undefined) {
        user.getCurrent(req.session.token, true, function(err, data) {
            res.utilrender(req, res, {
                user: data
            }); 
        });
    } else {
        res.utilrender(req, res); 
    }
};