const mongoose = require("mongoose");
const toJSON = require("../models/plugins/toJSON.plugin");

const passengerSchema = new mongoose.Schema(
  {
    title: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: Object },
    seatNo: { type: String },
    ticketStatus: { type: String, default: "CONFIRMED" },
  },
  { _id: false }
);

const fareSchema = new mongoose.Schema(
  {
    baseFare: { type: Number, required: true },
    taxes: { type: Number, required: true },
    seatCharges: { type: Number, default: 0 },
    mealCharges: { type: Number, default: 0 },
    baggageCharges: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
    },
    bookingReference: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    flightInstanceIds: {
      type: [String],
      required: true,
    },
    journeyDate: {
      type: Date,
    },
    sourceFrom: {
      type: String,
    },
    destinationTo: {
      type: String,
    },
    passengers: {
      adults: [passengerSchema],
      children: [passengerSchema],
      infants: [passengerSchema],
    },
    contact: {
      email: { type: String },
      number: { type: String },
    },
    gst: {
      isGst: { type: Boolean, default: false },
      gstNo: { type: String },
      companyName: { type: String },
    },
    fare: fareSchema,
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },
    bookingStatus: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED"],
      default: "PENDING",
    },
    bookingStatusMsg: {
      type: String,
    },
    seatSelections: {
      type: Object, // Stores the exact seat mapping like { "flightInstanceId": { "0": "1A" } }
    },
    mealSelections: {
      type: Object,
    },
    baggageSelections: {
      type: Object,
    }
  },
  {
    timestamps: true,
    collection: "Bookings",
  }
);

bookingSchema.plugin(toJSON);

bookingSchema.pre("save", function (next) {
  if (this.isNew) {
    const { bookingId } = this;
    if (!bookingId || typeof bookingId !== "string") {
      this.bookingId = crypto.randomUUID();
    }
    this._md = { ...this._md, createdBy: this.bookingId, createdDtm: new Date() };
  }
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);
