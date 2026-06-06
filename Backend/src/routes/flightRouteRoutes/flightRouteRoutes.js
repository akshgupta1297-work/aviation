const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middlewares/jwt");
const flightRouteController = require("../../controllers/flightRouteController/flightRoute.controller");

router.post("/add-flight-routes", verifyToken, flightRouteController.insertFlightRoutesController);
router.get("/get-flight-routes", flightRouteController.getFlightRoutesController);
router.put("/update-flight-route/:routeId", verifyToken, flightRouteController.updateFlightRouteController);
router.delete("/delete-flight-route/:routeId", verifyToken, flightRouteController.deleteFlightRouteController);

module.exports = router;
