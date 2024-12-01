require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const path = require('path');

const bodyParser = require('body-parser');
const cors = require('cors');


const db = require('./database/db');  // use db
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// Serve static files in the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// initialize Passport
app.use(passport.initialize());

// Passport config
require('./config/passport')(passport);

// route config
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404
app.use(function(req, res, next) {
  next(createError(404));
});


// Middleware for serving static files from the React build folder
app.use(express.static(path.join(__dirname, 'public/build')));

// API routes (add your existing API routes here)
app.use('/api/users', require('./routes/users'));
app.use('/api/upload', require('./routes/index'));

// Catch-all route to serve React's index.html for any unmatched routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/build', 'index.html'));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.title = 'Error';
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;