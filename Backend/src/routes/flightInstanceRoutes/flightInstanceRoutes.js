const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middlewares/jwt");
const flightInstanceController = require("../../controllers/flightInstanceController/flightInstance.controller");

router.post("/generate", verifyToken, flightInstanceController.generateFlightInstancesController);
router.get("/generate-7-days", flightInstanceController.generateFlightInstancesController);
router.get("/get-instances", verifyToken, flightInstanceController.getFlightInstancesController);
router.get("/search", flightInstanceController.searchFlightInstancesController);
router.delete("/delete-old", verifyToken, flightInstanceController.deleteOldFlightInstancesController);
router.get("/delete-old-instances", flightInstanceController.deleteOldFlightInstancesController);

module.exports = router;
