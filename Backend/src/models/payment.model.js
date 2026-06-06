const mongoose = require("mongoose");
const toJSON = require("../models/plugins/toJSON.plugin");


const paymentSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      unique: true,
    },
    bookingId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    provider: {
      type: String,
      default: "STRIPE",
    },
    transactionId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: "Payments",
  }
);

paymentSchema.plugin(toJSON);

paymentSchema.pre("save", function (next) {
  if (this.isNew) {
    const { paymentId } = this;
    if (!paymentId || typeof paymentId !== "string") {
      this.paymentId = crypto.randomUUID();
    }
    this._md = { ...this._md, createdBy: this.paymentId, createdDtm: new Date() };
  }
  next();
});

module.exports = mongoose.model("Payment", paymentSchema);
