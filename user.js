var fsq    = require('./foursquare').get()
  , db     = require('./database').get()
;
exports.update = function(userid, name) {
    db.user.update({ 
        fsid: userid 
    }, {
        fsid: userid,
        name: name,
    }, { 
        upsert: true 
    });
}

exports.setMonsters = function(userid, monsters) {
    db.user.update({ 
        fsid: userid 
    }, {
        $pushAll: { 
            monsters: monsters 
        }
    });
}