// ================================
// models/flightRoute.model.js
// ================================

const mongoose = require("mongoose");
const crypto = require("crypto");
const toJSON = require("./plugins/toJSON.plugin");
const paginate = require("./plugins/paginate.plugin");

const flightRouteSchema = new mongoose.Schema(
    {
        routeId: {
            type: String,
            unique: true,
        },
        sourceAirportId: {
            type: String,
            required: [true, "Source airport ID is required"],
            index: true,
        },
        destinationAirportId: {
            type: String,
            required: [true, "Destination airport ID is required"],
            index: true,
        },
        distanceKm: {
            type: Number,
            required: [true, "Distance is required"],
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
        averageDurationMinutes: {
            type: Number,
            required: [true, "Average duration is required"],
        },
        status: {
            type: String,
            enum: ["ACTIVE", "INACTIVE"],
            default: "ACTIVE",
        },
    },
    {
        timestamps: true,
        collection: "FlightRoutes",
    }
);

flightRouteSchema.plugin(toJSON);
flightRouteSchema.plugin(paginate);

flightRouteSchema.pre("save", function (next) {
    if (this.isNew) {
        const { routeId } = this;
        if (!routeId || typeof routeId !== "string") {
            this.routeId = crypto.randomUUID();
        }
        this._md = { ...this._md, createdBy: this.routeId, createdDtm: new Date() };
    }
    next();
});

module.exports = mongoose.model("FlightRoute", flightRouteSchema);
