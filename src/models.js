'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    fullName: { type: String, required: [true, 'Full name is required.'] },
    emailAddress: {
        type: String, required: true, unique: true,
        validate: {
            validator: function (value) {
                // check for correct email format
                return /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)
            },
            message: `Please enter a valid email address!`
        }
    },
    password: { type: String, required: true }
});

var ReviewSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    postedOn: { type: Date, default: Date.now },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String }
});

var CourseSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    estimatedTime: { type: String },
    materialsNeeded: { type: String },
    steps: [
        {
            stepNumber: {
                type: Number
            },
            title: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            }
        }
    ],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
});

// authenticate user input against database documents
UserSchema.statics.authenticate = function (email, password, callback) {
    User.findOne({ email: email })
        .exec(function (err, user) {
            if (err) {
                return callback(err);
            } else if (!user) {
                var error = new Error('User not found');
                error.status = 401;
                return callback(error);
            }
            bcrypt.compare(password, user.password, function (error, user) {
                if (user) {
                    return callback(null, user);
                } else {
                    return callback();
                }
            });
        });
}

// hash password before saving to database
UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        hash = user.password;
        next();
    });
});

var User = mongoose.model('User', UserSchema);
var Course = mongoose.model('Course', CourseSchema);
var Review = mongoose.model('Review', ReviewSchema);

module.exports.User = User;
module.exports.Course = Course;
module.exports.Review = Review;