var express = require('express');
var router = express.Router();
var User = require('../models');
var Course = require('../models');
var Review = require('../models');
var mid = require('../middleware/index');

// Return auth user
router.get('/', mid.userAuth, function (req, res, next) {
    User.findById(req.session.userId)
        .exec(function (error, user) {
            if (error) {
                return next(error)
            } else {
                res.status(200);
                return res.json('profile', { title: 'Profile', name: user.fullName });
            }
        });
});

// Create user
router.post('/', function (req, res, next) {
    if (req.body.fullName &&
        req.body.emailAddress &&
        req.body.password) {

        // object with form input
        var userData = {
            fullName: req.body.fullName,
            emailAddress: req.body.emailAddress,
            password: req.body.password
        };

        // schema's 'create' method to insert document into Mongo
        User.create(userData, function (error, user) {
            if (error) {
                res.status(400);
                return next(error);
            } else {
                req.session.userId = user._id;
                // set location header to '/', return no content
                res.location('/');
                res.status(201);
                return res.redirect('/profile');
            }
        });

    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
});

module.exports = router;