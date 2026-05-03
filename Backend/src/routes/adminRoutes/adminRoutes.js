const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/adminControllers/admin.controller");
const { verifyToken } = require("../../middlewares/jwt");

router.post("/create", adminController.createAdmin);
router.post("/login", adminController.login);
router.get("/get", verifyToken, adminController.getAdmin);

module.exports = router;