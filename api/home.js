var async = require('async');

exports.get = function(req, res, fsq) {
    if (req.session.token) {
        async.parallel({
            user: function(callback) {
                fsq.Users.getUser('self', req.session.token, function(err, data) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, data.user);
                    }
                });
            },
            
            checkins: function(callback) {
                fsq.Users.getCheckins(null, null, req.session.token, function(err, data) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, data.checkins);
                    }
                });
            }
        }, function(err, data) {
            console.log(data);
            
            data.title = 'Welcome Back';
            
            res.utilrender(req, res, data);
        }); 
        
    } else {
        console.log('no session data');
        
        res.utilrender(req, res, {
            'title': 'Nothing'
        });
    }
};