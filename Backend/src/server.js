const http = require("http");
const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const server = http.createServer(app);
const logger = require("./config/logger");
const cron = require("node-cron");
const { generateFlightInstancesService } = require("./services/flightInstanceService/flightInstance.service");
const { cancelUnpaidBookings } = require("./services/bookingService/booking.service");

// Schedule cron job to run every day at 02:00 AM
cron.schedule("0 14 * * *", async () => {
  logger.info("Running daily cron job for generating flight instances...");
  try {
    // Generate instances for the next 7 days
    const result = await generateFlightInstancesService(7);
    logger.info(`Cron Job Success: ${result.message}`);
  } catch (error) {
    logger.error(`Cron Job Error generating flight instances: ${error.message}`);
  }
});
cron.schedule("*/15 * * * *", async () => {
  logger.info("Running daily cron job for cancelling unpaid bookings...");
  try {
    // Generate instances for the next 7 days
    const result = await cancelUnpaidBookings();
    logger.info(`Cron Job Success: ${result.message}`);
  } catch (error) {
    logger.error(`Cron Job Error cancelling unpaid bookings: ${error.message}`);
  }
});

server.listen(process.env.PORT, () => {
  logger.info(`app is start running on port ${process.env.PORT}`);
});
