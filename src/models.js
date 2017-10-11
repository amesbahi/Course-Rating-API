'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    fullName: { type: String, required: [true, 'Full name is required.'] },
    emailAddress: {
        type: String, required: true, unique: true,
        validate: {
            validator: function (emailAddress) {
                // check for correct email format
                return /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(emailAddress)
            },
            message: `${emailAddress} is not a valid email address!`
        }
    },
    password: { type: String, required: true }
});

var CourseSchema = new Schema({
    user: UserSchema._id,
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
    reviews: [ReviewSchema._id]
});

var ReviewSchema = new Schema({
    user: UserSchema._id,
    postedOn: { type: Date, default: Date.now },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String }
});

var User = mongoose.model('User', UserSchema);
var Course = mongoose.model('Course', CourseSchema);
var Review = mongoose.model('Review', ReviewSchema);

module.exports.User = User;
module.exports.Course = Course;
module.exports.Review = Review;