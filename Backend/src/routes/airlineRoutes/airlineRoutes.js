const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middlewares/jwt");
const airlineController = require("../../controllers/airlineController/airline.controller");

router.post("/add-airlines", verifyToken, airlineController.insertAirlinesController);
router.get("/get-airlines", airlineController.getAirlinesController);
router.put("/update-airline/:airlineId", verifyToken, airlineController.updateAirlineController);
router.delete("/delete-airline/:airlineId", verifyToken, airlineController.deleteAirlineController);

module.exports = router;
