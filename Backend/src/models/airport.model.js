// ================================
// models/airport.model.js
// ================================

const mongoose = require("mongoose");

const airportSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        gmt: {
            type: String,
        },
        airport_id: {
            type: String,
        },
        iata_code: {
            type: String,
            index: true,
        },
        city_iata_code: {
            type: String,
        },
        city: {
            type: String,
        },
        icao_code: {
            type: String,
        },
        country_iso2: {
            type: String,
        },
        geoname_id: {
            type: String,
        },
        latitude: {
            type: String,
        },
        longitude: {
            type: String,
        },
        airport_name: {
            type: String,
            required: true,
        },
        country_name: {
            type: String,
        },
        phone_number: {
            type: String,
            default: null,
        },
        timezone: {
            type: String,
        },
    },
    {
        timestamps: true,
        collection: "Airports",
    }
);

module.exports = mongoose.model("Airport", airportSchema);