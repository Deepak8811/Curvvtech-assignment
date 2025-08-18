const express = require('express');
const authRoute = require('./auth.route');

const router = express.Router();

const deviceRoute = require('./device.route');

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/devices',
        route: deviceRoute,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
