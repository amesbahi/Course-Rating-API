'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    estimatedTime: { type: String },
    materialsNeeded: { type: String },
    steps: [
        { stepNumber: { type: Number } },
        { title: { type: String, required: true } },
        { description: { type: String, required: true } }
    ],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
});

const Course = mongoose.model('Course', CourseSchema);

module.exports.Course = Course;