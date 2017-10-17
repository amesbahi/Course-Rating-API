'use strict'

var auth = require('basic-auth');
var User = require('../models/User');

function userAuth(req, res, next) {
    var user = auth(req);
    if (!req.user) {
        var err = new Error('User is not authenticated.');
        next(err);
    }
    User.authenticate(req.user.emailAddress, req.user.password, function (error, user) {
        if (!user || error) {
            var err = new Error('Invalid email or password.');
            err.status = 401;
            next(err);
        }
        User.find({ emailAddress: req.user.emailAddress })
            .exec(function (error, user) {
                if (error) {
                    return next(error);
                } else {
                    req.auth = true;
                    req.user.id = user[0]._id;
                    return next();
                }
            });
    });
}

module.exports.userAuth = userAuth;