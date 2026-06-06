const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middlewares/jwt");
const aircraftController = require("../../controllers/aircraftController/aircraft.controller");

router.post("/add-aircrafts", verifyToken, aircraftController.insertAircraftsController);
router.get("/get-aircrafts", aircraftController.getAircraftsController);
router.put("/update-aircraft/:aircraftId", verifyToken, aircraftController.updateAircraftController);
router.delete("/delete-aircraft/:aircraftId", verifyToken, aircraftController.deleteAircraftController);

module.exports = router;
