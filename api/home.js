var async   = require('async')     // ASYNC used to load multiple sources and wait for all responses
  , promise = require('q')
  , cats    = require('../categories')
  , monster = require('../monster')
  , user    = require('../user')
;

exports.get = function(req, res) {
    user.get(function() {
        res.utilrender(req, res, {
            loggedIn: req.session.token !== undefined
        }); 
    });
};