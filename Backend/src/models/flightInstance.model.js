// ================================
// models/flightInstance.model.js
// ================================

const mongoose = require("mongoose");
const crypto = require("crypto");
const toJSON = require("./plugins/toJSON.plugin");
const paginate = require("./plugins/paginate.plugin");

const seatAvailabilitySchema = new mongoose.Schema(
    {
        isBooked: {
            type: Boolean,
            default: false,
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
        },
        seatNo: {
            type: String,
            required: [true, "Seat number is required"],
        },
        class: {
            type: String,
            enum: ["BUSINESS", "ECONOMY"],
            required: [true, "Seat class is required"],
        },
        type: {
            type: String,
            enum: ["WINDOW", "AISLE", "MIDDLE"],
            required: [true, "Seat type is required"],
        },
        seatCategory: {
            type: String,
            enum: ["STRETCH", "STANDARD", "XL", "UPFRONT"],
            required: [true, "Seat category is required"],
        },
        isBassinet: {
            type: Boolean,
            default: false,
        },
        isXL: {
            type: Boolean,
            default: false,
        }
    },
    { _id: false }
);

const liveStatusSchema = new mongoose.Schema(
    {
        gate: { type: String, default: null },
        terminal: { type: String, default: null },
        estimatedDeparture: { type: Date, default: null },
        estimatedArrival: { type: Date, default: null },
    },
    { _id: false }
);

const flightInstanceSchema = new mongoose.Schema(
    {
        flightInstanceId: {
            type: String,
            unique: true,
        },
        flightId: {
            type: String,
            required: [true, "Flight ID is required"],
            index: true,
        },
        flightNumber: {
            type: String,
            required: [true, "Flight Number is required"],
        },
        airlineLogo: {
            type: String,
            required: [true, "Flight Logo is required"],
        },
        airlineName: {
            type: String,
            required: [true, "Flight Logo is required"],
        },
        flightNumber: {
            type: String,
            index: true,
        },
        routeId: {
            type: String,
        },
        sourceAirportId: {
            type: String,
            index: true,
        },
        destinationAirportId: {
            type: String,
            index: true,
        },
        sourceAirportCode: {
            type: String,
        },
        destinationAirportCode: {
            type: String,
        },
        sourceAirportCity: {
            type: String,
        },
        destinationAirportCity: {
            type: String,
        },
        sourceAirportCountry: {
            type: String,
        },
        destinationAirportCountry: {
            type: String,
        },
        airlineId: {
            type: String,
            index: true,
        },
        baseFare: {
            type: Number,
        },
        date: {
            type: String,
            required: [true, "Date is required (YYYY-MM-DD)"],
            index: true,
        },
        departureDateTime: {
            type: Date,
            required: [true, "Departure DateTime is required"],
        },
        arrivalDateTime: {
            type: Date,
            required: [true, "Arrival DateTime is required"],
        },
        status: {
            type: String,
            enum: ["SCHEDULED", "ON_TIME", "DELAYED", "DEPARTED", "ARRIVED", "CANCELLED"],
            default: "SCHEDULED",
        },
        totalSeats: {
            economy: { type: Number, default: 0 },
            business: { type: Number, default: 0 },
        },
        availableSeats: {
            economy: { type: Number, default: 0 },
            business: { type: Number, default: 0 },
        },
        seatAvailability: [seatAvailabilitySchema],
        liveStatus: {
            type: liveStatusSchema,
            default: () => ({}),
        },
    },
    {
        timestamps: true,
        collection: "FlightInstances",
    }
);

flightInstanceSchema.index({ flightId: 1, date: 1 }, { unique: true });

flightInstanceSchema.plugin(toJSON);
flightInstanceSchema.plugin(paginate);

flightInstanceSchema.pre("save", function (next) {
    if (this.isNew) {
        const { flightInstanceId } = this;
        if (!flightInstanceId || typeof flightInstanceId !== "string") {
            this.flightInstanceId = crypto.randomUUID();
        }
        this._md = { ...this._md, createdBy: this.flightInstanceId, createdDtm: new Date() };
    }
    next();
});

module.exports = mongoose.model("FlightInstance", flightInstanceSchema);
