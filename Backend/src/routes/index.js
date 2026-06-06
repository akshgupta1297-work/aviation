const express = require("express");
const logger = require("../config/logger");
const app = express();

const adminRoutes = require("./adminRoutes/adminRoutes");
const userRoutes = require("./userRoutes/userRoutes");
const airportsRoutes = require("./airportRoutes/airportRoutes");
const airlineRoutes = require("./airlineRoutes/airlineRoutes");
const aircraftRoutes = require("./aircraftRoutes/aircraftRoutes");
const flightRouteRoutes = require("./flightRouteRoutes/flightRouteRoutes");
const flightRoutes = require("./flightRoutes/flightRoutes");
const flightInstanceRoutes = require("./flightInstanceRoutes/flightInstanceRoutes");
const paymentRoutes = require("./paymentRoutes/paymentRoutes");
const bookingRoutes = require("./bookingRoute/bookingRoute");


// Admin Routes
app.use("/admin", adminRoutes);
// User Routes
app.use("/user", userRoutes);
// Airport Routes
app.use("/airport", airportsRoutes);
// Airline Routes
app.use("/airline", airlineRoutes);
// Aircraft Routes
app.use("/aircraft", aircraftRoutes);
// Flight Route Routes
app.use("/flight-route", flightRouteRoutes);
// Flight Routes
app.use("/flight", flightRoutes);
// Flight Instance Routes
app.use("/flight-instance", flightInstanceRoutes);
// Payment Routes
app.use("/payment", paymentRoutes);
// Booking Routes
app.use("/booking", bookingRoutes);



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
