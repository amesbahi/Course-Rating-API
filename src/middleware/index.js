'use strict'

var auth = require('basic-auth');
var User = require('../models/User').User;

function userAuth(req, res, next) {
    req.user = auth(req);
    if (!req.user) {
        req.user = {
            name: 'none',
            pass: 'none'
        };
        next();
    } else {
        User.authenticate(req.user.name, req.user.pass, function (error, user) {
            if (!user || error) {
                var err = new Error('Invalid email or password.');
                err.status = 401;
                next(err);
            }
            User.find({ emailAddress: req.user.name })
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
}

module.exports.userAuth = userAuth;