const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { registerController, loginController, getUserByIdController } = require("../controllers/authCotroller");
const { validateRegisterRequest } = require("../utils/validationSchema");

const router = express.Router();

//Register
router.post("/register",validateRegisterRequest, registerController);

//login
router.post("/login", loginController);

//Get User By Id
router.get("/user/:userId", getUserByIdController);

module.exports = router;
