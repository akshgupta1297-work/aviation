const express = require("express");
const { verifyToken } = require("../../middlewares/jwt");
const paymentController = require("../../controllers/paymentController/payment.controller");

const router = express.Router();

router.post("/create-intent", verifyToken, paymentController.createIntent);
router.post("/confirm", verifyToken, paymentController.confirmPayment);

module.exports = router;
