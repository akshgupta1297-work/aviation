const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middlewares/jwt");
const bookingController = require("../../controllers/bookingController/booking.controller");

router.get("/get-bookings-by-user-id", verifyToken, bookingController.getBookingsByUserId);
router.get("/get-booking-details/:bookingId", verifyToken, bookingController.getBookingDetailsByBookingId);


module.exports = router;