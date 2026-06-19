// ================================
// models/flight.model.js
// ================================

const mongoose = require("mongoose");
const crypto = require("crypto");
const toJSON = require("./plugins/toJSON.plugin");
const paginate = require("./plugins/paginate.plugin");

const scheduleSchema = new mongoose.Schema(
    {
        departureTime: {
            type: String,
            required: [true, "Departure time is required"],
        },
        arrivalTime: {
            type: String,
            required: [true, "Arrival time is required"],
        },
        daysOfWeek: {
            type: [String],
            enum: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
            required: [true, "Days of week is required"],
        },
    },
    { _id: false }
);

const flightSchema = new mongoose.Schema(
    {
        flightId: {
            type: String,
            unique: true,
        },
        flightNumber: {
            type: String,
            required: [true, "Flight number is required"],
            index: true,
        },
        airlineId: {
            type: String,
            required: [true, "Airline ID is required"],
            index: true,
        },
        routeId: {
            type: String,
            required: [true, "Route ID is required"],
            index: true,
        },
        aircraftId: {
            type: String,
            required: [true, "Aircraft ID is required"],
            index: true,
        },
        schedule: {
            type: scheduleSchema,
            required: [true, "Schedule is required"],
        },
        baseFare: {
            type: Number,
            required: [true, "Base fare is required"],
        },
        status: {
            type: String,
            enum: ["ACTIVE", "INACTIVE"],
            default: "ACTIVE",
        },
    },
    {
        timestamps: true,
        collection: "Flights",
    }
);

flightSchema.plugin(toJSON);
flightSchema.plugin(paginate);

flightSchema.pre("save", function (next) {
    if (this.isNew) {
        const { flightId } = this;
        if (!flightId || typeof flightId !== "string") {
            this.flightId = crypto.randomUUID();
        }
        this._md = { ...this._md, createdBy: this.flightId, createdDtm: new Date() };
    }
    next();
});

module.exports = mongoose.model("Flight", flightSchema);
