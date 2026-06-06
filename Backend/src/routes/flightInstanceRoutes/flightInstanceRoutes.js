const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middlewares/jwt");
const flightInstanceController = require("../../controllers/flightInstanceController/flightInstance.controller");

router.post("/generate", verifyToken, flightInstanceController.generateFlightInstancesController);
router.get("/get-instances", verifyToken, flightInstanceController.getFlightInstancesController);
router.get("/search", flightInstanceController.searchFlightInstancesController);

module.exports = router;
