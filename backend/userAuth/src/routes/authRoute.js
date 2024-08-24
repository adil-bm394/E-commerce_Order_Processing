const express = require("express");
const {
  registerController,
  loginController,
} = require("../controllers/authControllers");
const { getUserByIdController } = require("../controllers/authCotroller");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

//Register
router.post("/register", registerController);

//login
router.post("/login", loginController);

//Get User By Id
router.get("/user",authMiddleware, getUserByIdController);

module.exports = router;
