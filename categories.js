var fsq = require('./foursquare')
  , fulllist
;

exports.update = function() {
    fsq.Venues.getCategories(null, null, function(err, data) {
        fulllist = data.categories;
    });
};

exports.get = function() {
    return fulllist;
}

exports.findTop = function(list, id, first) {
    for (var i in list) {
        if (list[i].id == id) {
            return true;
        } else if (list[i].categories) {
            if (exports.findTop(list[i].categories, id, false)) {
                return first === true ? list[i] : true;
            }
        }
    }    
    
    return false;
}
