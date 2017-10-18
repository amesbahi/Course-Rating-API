var express = require('express');
var router = express.Router();
var User = require('../models/User').User;
var Course = require('../models/Course').Course;
var Review = require('../models/Review').Review;
var session = require('express-session');
var mid = require('../middleware/index');

// Create user
router.post('/', function (req, res, next) {
    if (req.body.fullName &&
        req.body.emailAddress &&
        req.body.password &&
        req.body.confirmPassword) {

        if (req.body.password != req.body.confirmPassword) {
            var err = new Error('Passwords do not match!');
            err.status = 400;
            return next(err);
        }

        // object with form input
        var userData = {
            fullName: req.body.fullName,
            emailAddress: req.body.emailAddress,
            password: req.body.password
        };

        // schema's 'create' method to insert document into Mongo
        User.create(userData, function (error, user) {
            if (error) {
                return next(error);
            } else {
                // set location header to '/', return no content
                res.status(201);
                res.location('/');
                req.session.userId = user._id;
                return res.json(user);
            }
        });

    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
});

// Return auth user
router.get('/', mid.userAuth, function (req, res, next) {
    User.findById(req.session.userId)
        .exec(function (error, user) {
            if (error) {
                return next(error)
            } else {
                res.status(200);
                return res.json(user);
            }
        });
});

module.exports = router;