require('dotenv').config();

const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const db = require('./database/db'); // Import your database configuration
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const surveyRouter = require('./routes/survey');
const contactRouter = require('./routes/contact');

const app = express();

// Middleware setup
app.use(cors()); // Enable CORS for cross-origin requests
app.use(logger('dev')); // Logging
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(cookieParser()); // Parse cookies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from 'uploads'
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public'
app.use(express.static(path.join(__dirname, 'public/build'))); // Serve React's build folder

// View engine setup
app.set('views', path.join(__dirname, 'views')); // View templates folder
app.set('view engine', 'jade'); // Use Jade (Pug) as the view engine

// Passport initialization
app.use(passport.initialize());
require('./config/passport')(passport); // Passport configuration

// app.use((req, res, next) => {
//     console.log(`${req.method} ${req.url} - Body:`, req.body);
//     next();
// });

// Route configurations
app.use('/', indexRouter); // Root routes
app.use('/survey', surveyRouter); // Survey routes
app.use('/users', usersRouter); // User routes
app.use('/contact', contactRouter); // User routes

// Error handling middleware
app.use((err, req, res, next) => {
    res.locals.message = err.message; // Pass error message to locals
    res.locals.error = req.app.get('env') === 'development' ? err : {}; // Show stack trace in development only
    res.locals.title = 'Error'; // Title for the error page
    res.status(err.status || 500); // Default to 500 status code
    res.render('error'); // Render error view
});

// React fallback route for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/build', 'index.html'));
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

module.exports = app;