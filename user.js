var fsq    = require('./foursquare').get()
  , db     = require('./database').get()
;

exports.get = function(id, callback) {
    db.user.find({
        _id: id
    }, callback);
}

exports.getList = function(callback) {
    db.user.find({}, callback);
}

exports.getCurrent = function(token, getCritters, callback) {
    db.user.findOne({
        token: token
    }, function(err, user) {
        if (getCritters) {
            db.critter.find({
                _id: {
                    $in: user.monsters
                }
            }, function(err, monsters) {
                user.monsters = monsters;
                callback(null, user);
            });
        } else {
            callback(null, user);
        }
    });
}

exports.updateCurrent = function(token, name) {
    db.user.update({ 
        token: token
    }, {
        token:  token,
        name:   name,
    }, { 
        upsert: true 
    });
}

exports.setMonsters = function(token, monsters) {
    db.user.update({ 
        token: token 
    }, {
        $pushAll: { 
            monsters: monsters 
        }
    });
}