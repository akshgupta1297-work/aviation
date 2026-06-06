const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middlewares/jwt");
const bookingController = require("../../controllers/bookingController/booking.controller");

router.get("/get-bookings-by-user-id", verifyToken, bookingController.getBookingsByUserId);


module.exports = router;