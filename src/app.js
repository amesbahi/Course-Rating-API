'use strict';

// load modules
var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var userRoutes = require('../routes/users');
var courseRoutes = require('../routes/courses');

app.use('/users', userRoutes);
app.use('/courses', courseRoutes);

var app = express();

var seeder = require('mongoose-seeder'),
  data = require('./data.json');

seeder.seed(data).then(function (dbData) {
  // The database objects are stored in dbData
}).catch(function (err) {
  // handle error
  console.error(err);
});

mongoose.connect('mongodb://localhost:27017/dev');

var db = mongoose.connection;

db.on('error', function (err) {
  console.error(`connection error: ${err}`);
});

db.once("open", function () {
  console.log(`db connection successful!`);
});

// set our port
app.set('port', process.env.PORT || 5000);

// morgan gives us http request logging
app.use(morgan('dev'));

// setup our static route to serve files from the "public" folder
app.use('/', express.static('public'));

// catch 404 and forward to global error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// Express's global error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// start listening on our port
var server = app.listen(app.get('port'), function () {
  console.log('Express server is listening on port ' + server.address().port);
});
