const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const paymentService = require("../../services/paymentService/payment.service");
const bookingService = require("../../services/bookingService/booking.service");
const { successResponseGenerator, errorResponse } = require("../../utils/ApiHelpers");

const getBookingsByUserId = catchAsync(async (req, res) => {
    const bookings = await bookingService.getBookingsByUserId(req.id);
    res.status(httpStatus.status.OK).send(successResponseGenerator(httpStatus.status.OK, "Bookings fetched successfully", bookings));
})
module.exports = {
    getBookingsByUserId
}