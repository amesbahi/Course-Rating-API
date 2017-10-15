var express = require('express');
var router = express.Router();
var User = require('./models');
var Course = require('./models');
var Review = require('./models');
var mid = require('../middleware');

// Get courses
router.get('/', function (req, res, next) {
    Course.find({})
        .exec(function (error, courses) {
            if (error) {
                return next(error);
            } else {
                res.status(200);
                return res.json({ id: courses._id, title: courses.title });
            }
        });
});

// Get course by id
router.get('/:courseId', function (req, res, next) {
    Course.findById(courseId)
        .populate('user')
        .populate('reviews')
        .exec(function (error, course) {
            if (error) {
                return next(error);
            } else {
                res.status(200);
                return res.json(course);
            }
        });
});

// Create a course
router.post('/', function (req, res, next) {
    var course = new Course(req.body);
    course.save(function (err, course) {
        if (err) {
            res.status(400);
            return next(err);
        } else {
            // set location header to '/', return no content
            res.location('/');
            res.status(201);
            return res.json(course);
        }
    });
});

// Update a course
router.put('/courses/:courseId', function (req, res, next) {
    req.course.update(req.body, function (err, result) {
        if (err) {
            res.status(400);
            return next(err);
        }
        res.status(204);
        return res.json(result);
    });
});

// Create a review for a specific course
router.post('/:courseId/reviews', function (req, res, next) {
    req.course.reviews.push(req.body);
    req.course.save(function (err, course) {
        if (err) {
            res.status(400);
            return next(err);
        }
        res.location('/:courseId');
        res.status(201);
        res.json(course);
    });
});