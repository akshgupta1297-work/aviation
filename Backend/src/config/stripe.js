const config = require("../config/config");
const Stripe = require("stripe");

const stripe = new Stripe(config.paymentLinks.stripeSecretKey);


module.exports = stripe;
