// ================================
// models/airline.model.js
// ================================

const mongoose = require("mongoose");
const crypto = require("crypto");
const toJSON = require("./plugins/toJSON.plugin");
const paginate = require("./plugins/paginate.plugin");

const airlineSchema = new mongoose.Schema(
    {
        airlineId: {
            type: String,
            unique: true,
        },
        name: {
            type: String,
            required: [true, "Airline name is required"],
        },
        iataCode: {
            type: String,
            unique: true,
            index: true,
        },
        icaoCode: {
            type: String,
        },
        country: {
            type: String,
            required: [true, "Country is required"]
        },
        logo: {
            type: String,
            default: null,
        },
        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active",
        },
    },
    {
        timestamps: true,
        collection: "Airlines",
    }
);

airlineSchema.plugin(toJSON);
airlineSchema.plugin(paginate);

airlineSchema.pre("save", function (next) {
    if (this.isNew) {
        const { airlineId } = this;
        if (!airlineId || typeof airlineId !== "string") {
            this.airlineId = crypto.randomUUID();
        }
        this._md = { ...this._md, createdBy: this.airlineId, createdDtm: new Date() };
    }
    next();
});

module.exports = mongoose.model("Airline", airlineSchema);
