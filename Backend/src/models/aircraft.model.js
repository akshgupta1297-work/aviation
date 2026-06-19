// ================================
// models/aircraft.model.js
// ================================

const mongoose = require("mongoose");
const crypto = require("crypto");
const toJSON = require("./plugins/toJSON.plugin");
const paginate = require("./plugins/paginate.plugin");

const seatSchema = new mongoose.Schema(
    {
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

const aircraftSchema = new mongoose.Schema(
    {
        aircraftId: {
            type: String,
            unique: true,
        },
        airlineId: {
            type: String,
            required: [true, "Airline ID is required"],
            index: true,
        },
        model: {
            type: String,
            required: [true, "Aircraft model is required"],
        },
        registrationNumber: {
            type: String,
            required: [true, "Registration number is required"],
            unique: true,
        },
        seatLayout: {
            business: {
                type: Number,
                default: 0,
            },
            economy: {
                type: Number,
                default: 0,
            },
        },
        seatMap: [seatSchema],
        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active",
        },
    },
    {
        timestamps: true,
        collection: "Aircrafts",
    }
);

aircraftSchema.plugin(toJSON);
aircraftSchema.plugin(paginate);

aircraftSchema.pre("save", function (next) {
    if (this.isNew) {
        const { aircraftId } = this;
        if (!aircraftId || typeof aircraftId !== "string") {
            this.aircraftId = crypto.randomUUID();
        }
        this._md = { ...this._md, createdBy: this.aircraftId, createdDtm: new Date() };
    }
    next();
});

module.exports = mongoose.model("Aircraft", aircraftSchema);
