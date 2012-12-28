var fsq    = require('./foursquare')
  , db     = require('./database')
  , userid
;

exports.get = function(callback) {
    fsq.Users.getUser('self', fsq.getToken(), function(err, data) {
        if (err) {
            callback(err);
        } else {
            db.user.update({ fsid: data.user.id }, {
                fsid: data.user.id,
                name: data.user.firstName + ' ' + data.user.lastName,
            }, { upsert: true });
            
            userid = data.user.id;
            callback(null, data.user);
        }
    });
}

exports.getCheckins = function(callback) {
    fsq.Users.getVenueHistory(null, null, fsq.getToken(), function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data.venues);
        }
    });
}

exports.getBadges = function(callback) {
    fsq.Users.getBadges(null, fsq.getToken(), function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data.badges);
        }
    });
}

exports.setMonsters = function(monsters) {
    db.user.update({ fsid: userid }, {
        $pushAll: { monsters: monsters }
    });
}