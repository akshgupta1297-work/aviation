const Payment = require("../../models/payment.model");
const stripe = require("../../config/stripe");


/**
 * Create a Stripe Payment Intent and initialize Payment record
*/
const createPaymentIntent = async (bookingId, amount, currency, userId) => {
  // Stripe expects amount in minimum currency units (paise for INR)
  console.log(bookingId, amount, currency, userId, "??????");

  const amountInPaise = Math.round(amount * 100);
  console.log("paymentIntent");
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInPaise,
    currency: currency.toLowerCase(),
    metadata: { bookingId: bookingId.toString(), userId: userId.toString() },
  });
  console.log("paymentIntent");

  const payment = await Payment.create({
    bookingId,
    userId,
    amount: amount, // Storing base amount
    currency,
    provider: "STRIPE",
    transactionId: paymentIntent.id,
    status: "PENDING",
  });
  console.log("paymentIntentclient_secret", paymentIntent.client_secret);

  return { clientSecret: paymentIntent.client_secret, paymentId: payment.paymentId, bookingId };
};

/**
 * Confirm the payment status from Stripe and update database
 */
const confirmPayment = async (paymentIntentId) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  console.log(paymentIntent.status, " paymentIntent.status service");

  if (paymentIntent.status === "succeeded") {
    const payment = await Payment.findOneAndUpdate(
      { transactionId: paymentIntentId },
      { status: "SUCCESS", paidAt: new Date() },
      { new: true }
    );
    return payment;
  } else {
    await Payment.findOneAndUpdate(
      { transactionId: paymentIntentId },
      { status: "FAILED", paidAt: new Date() },
      { new: true }
    );
    throw new Error("Payment not successful in Stripe");
  }
};
module.exports = {
  createPaymentIntent,
  confirmPayment,
};
