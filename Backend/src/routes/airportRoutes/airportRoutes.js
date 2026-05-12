const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middlewares/jwt");
const airportsController = require("../../controllers/airportController/airport.controller");

router.post("/add-airports", verifyToken, airportsController.insertAirportsController);

module.exports = router;