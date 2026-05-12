const express = require("express");
const logger = require("../config/logger");
const app = express();

const adminRoutes = require("./adminRoutes/adminRoutes");
const airportsRoutes = require("./airportRoutes/airportRoutes");


// Admin Routes
app.use("/admin", adminRoutes);
// Flight Routes
app.use("/airport", airportsRoutes);



app.get("/health", (req, res) => {
  const healthCheckResponse = {
    status: "ok",
    uptime: process.uptime(), // how long server has been running
    timestamp: Date.now(), // current time
    memoryUsage: process.memoryUsage(), // optional: memory details
  };
  logger.info(`helth check api response ${JSON.stringify(healthCheckResponse)}`);
  res.json(healthCheckResponse);
});

app.use((req, res, next) => {
  res.status(400).json({
    message: "Not found",
  });
});

module.exports = app;
