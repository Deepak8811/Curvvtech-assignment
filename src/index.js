const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/config');
const deactivateInactiveDevicesJob = require('./jobs/deactivateInactiveDevices');

const connectDB = require('./config/db');

const passport = require('passport');
const app = express();

// Initialize passport
app.use(passport.initialize());

// Connect to database
connectDB();

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors());
app.options('*', cors());

// Parse json request body
app.use(express.json());

const routes = require('./api/routes');

// v1 api routes
app.use('/v1', routes);

app.get('/health', (req, res) => {
    res.status(200).send({ status: 'ok' });
});

// Start background jobs
deactivateInactiveDevicesJob.start();
console.log('Deactivate inactive devices job scheduled.');

// Start server
app.listen(config.port, () => {
  console.log(`Listening to port ${config.port}`);
});

module.exports = app;
