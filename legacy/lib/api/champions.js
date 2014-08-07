var user    = require('../object/user')
;

exports.get = function(req, res) {
    user.getList(function(err, data) {
        res.utilrender(req, res, {
            users: data
        }); 
    });
};