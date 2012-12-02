var db    = require('../database.js');
  
exports.get = function(req, res, fsq) {
    res.utilrender(req, res, {
        'title': 'account',
        'user': 'kevin'
    });
};