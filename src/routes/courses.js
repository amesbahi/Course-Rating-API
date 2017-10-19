var express = require('express');
var router = express.Router();
var User = require('../models/User').User;
var Course = require('../models/Course').Course;
var Review = require('../models/Review').Review;
var mid = require('../middleware/index');

// Get courses
router.get('/', function (req, res, next) {
    Course.find({}, '_id title')
        .exec(function (error, courses) {
            if (error) {
                return next(error);
            } else {
                res.status(200);
                return res.json(courses);
            }
        });
});

// Get course by id
router.get('/:courseId', function (req, res, next) {
    Course.findById(req.params.courseId)
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
router.post('/', mid.userAuth, function (req, res, next) {
    var course = new Course(req.body);
    course.save(function (err, course) {
        if (err) {
            res.status(400);
            return next(err);
        } else {
            // set location header to '/', return no content
            res.location('/');
            res.status(201).json();
        }
    });
});

// Update a course
router.put('/:courseId', mid.userAuth, function (req, res, next) {
    Course.findByIdAndUpdate(req.body._id, req.body, { upsert: true })
        .exec(function (err, course) {
            if (err) {
                res.status(400);
                return next(err);
            }
            res.status(204).json();
        });
});

// Create a review for a specific course
router.post('/:courseId/reviews', mid.userAuth, function (req, res, next) {
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

module.exports = router;