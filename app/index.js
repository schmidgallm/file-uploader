// Dependencies
const express = require('express');
const logger = require('morgan');
const cors = require('cors');

// Routes
const imageRoute = require('../routes/api/image');

// Init app
const app = express();

// Use morgan to log all requests
app.use(logger('dev'));

// Body Parser Middleware
app.use(express.json({ extended: true }));

// Cors middleware
app.use(cors());

// static path reference to hold uploaded images
app.use('../uploads', express.static('uploads'));

// Init api routes here
app.use('/api/v1/images', imageRoute);

// Export app to for server to use
module.exports = app;
