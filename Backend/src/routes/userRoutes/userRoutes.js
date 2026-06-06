const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userControllers/user.controller");
const { verifyToken } = require("../../middlewares/jwt");

router.post("/create", userController.createUser);
router.post("/login", userController.login);
router.get("/get", verifyToken, userController.getUser);

module.exports = router;