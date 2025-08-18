const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const config = require('./config');

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
const deactivateInactiveDevicesJob = require('./jobs/deactivateInactiveDevices');

// v1 api routes
app.use('/v1', routes);

app.get('/health', (req, res) => {
    res.status(200).send({ status: 'ok' });
});

// Start background jobs
deactivateInactiveDevicesJob.start();

// Start server
const server = app.listen(config.port, () => {
    // In a real app, you'd use a logger here.
    console.log(`Server listening on port ${config.port}`);
});

module.exports = app;
