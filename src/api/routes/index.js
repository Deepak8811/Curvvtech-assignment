import express from "express";
import authRoute from "./auth.route.js";
import deviceRoute from "./device.route.js";

const router = express.Router();

/**
 * List of all default routes
 */
const defaultRoutes = [
    { path: "/auth", route: authRoute },
    { path: "/devices", route: deviceRoute },
];

// Register default routes
defaultRoutes.forEach(({ path, route }) => {
    router.use(path, route);
});

export default router;
