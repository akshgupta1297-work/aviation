const Booking = require("../../models/booking.model");
const Payment = require("../../models/payment.model");
const FlightInstance = require("../../models/flightInstance.model");
const stripe = require("../../config/stripe");

/**
 * Create a pending booking
 */
const createBooking = async (bookingData) => {
  // Generate random 6-character PNR
  const bookingReference = "PNR" + Math.floor(100000 + Math.random() * 900000);
  // console.log(bookingData, bookingReference);

  const booking = await Booking.create({
    ...bookingData,
    bookingReference,
    paymentStatus: "PENDING",
    bookingStatus: "PENDING",
  });
  // console.log(booking);

  if (!booking) {
    throw new Error("Booking not created");
  }
  return booking;
};

/**
 * Confirm booking after successful payment and lock seats
 */
const confirmBooking = async (bookingId) => {
  console.log(bookingId, "??????");

  const booking = await Booking.findOne({ bookingId: bookingId });
  // console.log(booking, "????booking??????");
  if (!booking) {
    throw new Error("Booking not found");
  }

  booking.paymentStatus = "PAID";
  booking.bookingStatus = "CONFIRMED";

  // console.log(booking, "????booking??????");
  await booking.save();

  // Lock the seats in the FlightInstances
  const seatSelections = booking.seatSelections || {};

  for (const flightInstanceId of booking.flightInstanceIds) {
    const instance = await FlightInstance.findOne({ flightInstanceId });
    if (instance) {
      const seatsToBook = Object.values(seatSelections[flightInstanceId] || {});
      // console.log(seatsToBook.length, "<<<<<<<>>>>>?????seatsToBook.length");

      let updated = false;
      if (instance.seatAvailability && instance.seatAvailability.length > 0) {
        instance.seatAvailability.forEach(seat => {
          if (seatsToBook.includes(seat.seatNo)) {
            seat.isBooked = true;
            updated = true;
          }
        });
      }
      instance.availableSeats.economy = instance.availableSeats.economy - seatsToBook.length;
      // console.log(updated, "updated???????????");

      if (updated) {
        // Mongoose sometimes doesn't track deep array modifications automatically
        instance.markModified('seatAvailability');
        instance.markModified('availableSeats');
        await instance.save();
      }
    }
  }

  return booking;
};

const getBookingsByUserId = async (userId) => {
  const upcomingBooking = await Booking.find({
    userId: userId,
    paymentStatus: "PAID",
    journeyDate: { $gt: new Date(Date.now()) }
  })
    .sort({ createdAt: -1 })
    .lean();
  // const myflightInstance = await FlightInstance.find({
  //   flightInstanceId: { $in: upcomingBooking[0].flightInstanceIds }
  // })
  //   .sort({ createdAt: -1 })
  //   .lean();
  // console.log(myflightInstance);

  const pastBookings = await Booking.find({
    userId,
    paymentStatus: "PAID",
    bookingStatus: { $ne: "CANCELLED" },
    journeyDate: { $lt: new Date(Date.now()) }
  })
    .sort({ journeyDate: -1 })
    .lean();
  const cancelledBookings = await Booking.find({
    userId,
    bookingStatus: "CANCELLED"
  })
    .sort({ createdAt: -1 })
    .lean();
  const bookings = { upcomingBooking, pastBookings, cancelledBookings }
  if (!bookings) {
    throw new Error("Booking not found");
  }
  return bookings;
}
const getBookingDetailsByBookingId = async (userId, bookingId) => {
  const booking = await Booking.findOne({
    userId: userId,
    bookingId: bookingId,
  })
    .sort({ createdAt: -1 })
    .lean();
  const myflightInstance = await FlightInstance.find({
    flightInstanceId: { $in: booking.flightInstanceIds }
  })
    .sort({ createdAt: -1 })
    .lean();
  console.log(myflightInstance, "myflightInstance");



  if (!booking) {
    throw new Error("Booking not found");
  }
  const bookingDetails = { ...booking, myflightInstance };
  return bookingDetails;
}

const cancelUnpaidBookings = async () => {
  const bookings = await Booking.find({ paymentStatus: "PENDING", bookingStatus: "PENDING", createdAt: { $lt: new Date(Date.now()) } });
  // + 15 * 60 * 1000

  if (!bookings) {
    throw new Error("Bookings not found");
  }
  // console.log(bookings);

  bookings.forEach(async booking => {
    const payment = await Payment.findOne({ bookingId: booking.bookingId });
    // console.log(payment);

    const paymentIntent = await stripe.paymentIntents.retrieve(payment.transactionId);
    console.log(paymentIntent, "????");
    if (paymentIntent?.last_payment_error?.code) {
      booking.paymentStatus = "FAILED";
      booking.bookingStatus = "CANCELLED";
      booking.bookingStatusMsg = paymentIntent?.last_payment_error?.message;
      booking.save();
    } else {
      booking.paymentStatus = "FAILED";
      booking.bookingStatus = "CANCELLED";
      booking.bookingStatusMsg = "Booking cancelled due to payment failure";
      booking.save();
    }
  });
  return bookings;
};

module.exports = {
  createBooking,
  confirmBooking,
  getBookingsByUserId,
  getBookingDetailsByBookingId,
  cancelUnpaidBookings,
};
