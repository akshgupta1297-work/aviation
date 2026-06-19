const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middlewares/jwt");
const flightController = require("../../controllers/flightController/flight.controller");

router.post("/add-flights", verifyToken, flightController.insertFlightsController);
router.get("/get-flights", flightController.getFlightsController);
router.put("/update-flight/:flightId", verifyToken, flightController.updateFlightController);
router.delete("/delete-flight/:flightId", verifyToken, flightController.deleteFlightController);

module.exports = router;
