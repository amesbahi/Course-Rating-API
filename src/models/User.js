'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fullName: { type: String, required: [true, 'Full name is required.'] },
    emailAddress: {
        type: String, required: [true, 'Email is required.'],
        unique: [true, 'This email is already registered.'],
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

// authenticate user input against database documents
UserSchema.statics.authenticate = function (email, password, callback) {
    User.findOne({ emailAddress: email })
        .exec(function (err, user) {
            if (err) {
                return callback(err);
            } else if (!user) {
                let error = new Error('User not found');
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
    let user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});

var User = mongoose.model('User', UserSchema);

module.exports.User = User;