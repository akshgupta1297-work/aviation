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

  let flightInstances = bookingData.flightInstances || [];
  const flightInstanceIds =
    bookingData.flightInstanceIds ||
    (Array.isArray(flightInstances) ? flightInstances.map((f) => f.flightInstanceId || f._id).filter(Boolean) : []);

  // If flightInstances not provided or empty, query them from DB to create the snapshot
  if ((!flightInstances || flightInstances.length === 0) && flightInstanceIds && flightInstanceIds.length > 0) {
    const instances = await FlightInstance.find({ flightInstanceId: { $in: flightInstanceIds } }).lean();
    if (instances && instances.length > 0) {
      flightInstances = instances.map((inst) => ({
        flightInstanceId: inst.flightInstanceId,
        flightNumber: inst.flightNumber,
        airlineName: inst.airlineName,
        airlineLogo: inst.airlineLogo,
        sourceAirportId: inst.sourceAirportId,
        sourceAirportCode: inst.sourceAirportCode,
        sourceAirportCity: inst.sourceAirportCity,
        sourceAirportCountry: inst.sourceAirportCountry,
        destinationAirportId: inst.destinationAirportId,
        destinationAirportCode: inst.destinationAirportCode,
        destinationAirportCity: inst.destinationAirportCity,
        destinationAirportCountry: inst.destinationAirportCountry,
        departureDateTime: inst.departureDateTime,
        arrivalDateTime: inst.arrivalDateTime,
        baseFare: inst.baseFare,
        status: inst.status || "SCHEDULED",
      }));
    }
  } else if (Array.isArray(flightInstances) && flightInstances.length > 0) {
    // Sanitize and ensure format
    flightInstances = flightInstances.map((inst) => ({
      flightInstanceId: inst.flightInstanceId || inst._id,
      flightNumber: inst.flightNumber,
      airlineName: inst.airlineName,
      airlineLogo: inst.airlineLogo,
      sourceAirportId: inst.sourceAirportId,
      sourceAirportCode: inst.sourceAirportCode,
      sourceAirportCity: inst.sourceAirportCity,
      sourceAirportCountry: inst.sourceAirportCountry,
      destinationAirportId: inst.destinationAirportId,
      destinationAirportCode: inst.destinationAirportCode,
      destinationAirportCity: inst.destinationAirportCity,
      destinationAirportCountry: inst.destinationAirportCountry,
      departureDateTime: inst.departureDateTime,
      arrivalDateTime: inst.arrivalDateTime,
      baseFare: inst.baseFare,
      status: inst.status || "SCHEDULED",
    }));
  }

  const booking = await Booking.create({
    ...bookingData,
    flightInstanceIds,
    flightInstances,
    bookingReference,
    paymentStatus: "PENDING",
    bookingStatus: "PENDING",
  });

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
  if (!booking) {
    throw new Error("Booking not found");
  }

  booking.paymentStatus = "PAID";
  booking.bookingStatus = "CONFIRMED";
  await booking.save();

  // Lock the seats in the FlightInstances if they exist
  const seatSelections = booking.seatSelections || {};
  const instanceIds =
    booking.flightInstanceIds && booking.flightInstanceIds.length > 0
      ? booking.flightInstanceIds
      : (booking.flightInstances || []).map((f) => f.flightInstanceId).filter(Boolean);

  for (const flightInstanceId of instanceIds) {
    const instance = await FlightInstance.findOne({ flightInstanceId });
    if (instance) {
      const seatsToBook = Object.values(seatSelections[flightInstanceId] || {});

      let updated = false;
      if (instance.seatAvailability && instance.seatAvailability.length > 0) {
        instance.seatAvailability.forEach((seat) => {
          if (seatsToBook.includes(seat.seatNo)) {
            seat.isBooked = true;
            updated = true;
          }
        });
      }
      if (instance.availableSeats?.economy !== undefined) {
        instance.availableSeats.economy = instance.availableSeats.economy - seatsToBook.length;
      }

      if (updated) {
        instance.markModified("seatAvailability");
        instance.markModified("availableSeats");
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

  const bookings = { upcomingBooking, pastBookings, cancelledBookings };
  if (!bookings) {
    throw new Error("Booking not found");
  }
  return bookings;
};

const getBookingDetailsByBookingId = async (userId, bookingId) => {
  const booking = await Booking.findOne({
    userId: userId,
    bookingId: bookingId,
  })
    .sort({ createdAt: -1 })
    .lean();

  if (!booking) {
    throw new Error("Booking not found");
  }

  // First check if booking document already contains the full snapshot of flightInstances
  let flightInstances = booking.flightInstances || [];

  // Fallback for older records where flightInstances was not saved
  if ((!flightInstances || flightInstances.length === 0) && booking.flightInstanceIds && booking.flightInstanceIds.length > 0) {
    const myflightInstance = await FlightInstance.find({
      flightInstanceId: { $in: booking.flightInstanceIds }
    })
      .sort({ createdAt: -1 })
      .lean();
    flightInstances = myflightInstance || [];
  }

  const bookingDetails = {
    ...booking,
    flightInstances,
    myflightInstance: flightInstances, // Supported for backward compatibility
  };
  return bookingDetails;
};

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
