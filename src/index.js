import express from "express";
import helmet from "helmet";
import cors from "cors";
import passport from "passport";

import config from "./config/index.js";
import connectDB from "./config/db.js";
import deactivateInactiveDevicesJob from "./jobs/deactivateInactiveDevices.js";
import routes from "./api/routes/index.js";

const app = express();

/* -------------------- Database Connection -------------------- */
connectDB();

/* -------------------- Middlewares -------------------- */
// Security headers
app.use(helmet());

// Enable CORS
app.use(cors());
app.options("*", cors());

// Parse JSON requests
app.use(express.json());

// Initialize Passport for authentication
app.use(passport.initialize());

/* -------------------- API Routes -------------------- */
app.use("/v1", routes);

// Health Check
app.get("/health", (_, res) => {
  res.status(200).json({ status: "ok" });
});

/* -------------------- Background Jobs -------------------- */
deactivateInactiveDevicesJob.start();
console.log("Deactivate inactive devices job scheduled.");

/* -------------------- Start Server -------------------- */
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

export default app;
