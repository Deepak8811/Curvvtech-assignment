import express from "express";
import helmet from "helmet";
import cors from "cors";
import passport from "passport";

import config from "./config/index.js";
import connectDB from "./config/db.js";
import deactivateInactiveDevicesJob from "./jobs/deactivateInactiveDevices.js";
import routes from "./api/routes/index.js";

const app = express();

connectDB();

app.use(helmet());

app.use(cors());

app.options("*", cors());

app.use(express.json());

app.use(passport.initialize());

app.use("/v1", routes);

app.get("/health", (_, res) => {
  res.status(200).json({ status: "ok" });
});

deactivateInactiveDevicesJob.start();
console.log("Deactivate inactive devices job scheduled.");


app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

export default app;
