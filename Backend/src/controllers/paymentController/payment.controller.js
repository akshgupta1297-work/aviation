const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const paymentService = require("../../services/paymentService/payment.service");
const bookingService = require("../../services/bookingService/booking.service");
const { successResponseGenerator, errorResponse } = require("../../utils/ApiHelpers");



const createIntent = catchAsync(async (req, res) => {
  const {
    flightInstanceIds,
    passengers,
    contact,
    journeyDate,
    sourceFrom,
    destinationTo,
    gst,
    fare,
    seatSelections,
    mealSelections,
    baggageSelections
  } = req.body;
  // console.log(req.body);

  // Get userId from the token middleware
  const userId = req.id;

  if (!userId) {
    return res
      .status(httpStatus.status.UNAUTHORIZED)
      .send(errorResponse(httpStatus.status.UNAUTHORIZED, "Unauthorized"));
  }


  // 1. Create a PENDING booking
  // console.log("??????????");

  const booking = await bookingService.createBooking({
    userId,
    flightInstanceIds,
    passengers,
    contact,
    journeyDate: new Date(journeyDate),
    sourceFrom,
    destinationTo,
    gst,
    fare,
    seatSelections,
    mealSelections,
    baggageSelections
  });
  // console.log("create", booking.bookingId);
  // 2. Create Stripe Payment Intent
  const paymentIntent = await paymentService.createPaymentIntent(
    booking.bookingId,
    fare.total,
    "INR", // Assuming INR, can be made dynamic
    userId
  );
  const resultData = {
    clientSecret: paymentIntent.clientSecret,
    bookingId: booking.bookingId,
    bookingReference: booking.bookingReference,
    paymentId: paymentIntent.paymentId,
  }
  res
    .status(httpStatus.status.OK)
    .send(
      successResponseGenerator(
        httpStatus.status.OK,
        "Payment Intent Created Successfully",
        resultData
      )
    );
});

const confirmPayment = catchAsync(async (req, res) => {
  const { paymentIntentId, bookingId } = req.body;
  // console.log(req.body);

  if (!paymentIntentId || !bookingId) {
    return res.status(httpStatus.status.BAD_REQUEST).send(errorResponse(httpStatus.status.BAD_REQUEST, "paymentIntentId and bookingId are required"));
  }

  // 1. Confirm payment status with Stripe
  const payment = await paymentService.confirmPayment(paymentIntentId);

  // 2. If success, lock seats and confirm booking
  console.log(payment.status, "payment.status controller");
  if (payment.status === "SUCCESS") {

    const booking = await bookingService.confirmBooking(bookingId);
    return res.status(httpStatus.status.OK)
      .send(
        successResponseGenerator(
          httpStatus.status.OK,
          "Payment successful and booking confirmed",
          booking
        )
      );
  } else {
    return res
      .status(error.statusCode)
      .send(errorResponse(error.statusCode, error.message));;
  }
});

module.exports = {
  createIntent,
  confirmPayment,
};
