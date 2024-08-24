const userModel = require("../models/userModel");
const messages = require("../utils/messages");
const statusCodes = require("../utils/statusCodes");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const serverConfig = require("../config/serverConfig");

//RegisterController
const registerController = async (req, res) => {
  const { name, email, password, phone } = req.body;
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return res
      .status(statusCodes.OK)
      .json({ success: false, message: messages.USER_EXISTS });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    res.status(statusCodes.CREATED).json({
      success: "true",
      message: messages.REGISTER_SUCCESS,
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

//Login Controller
const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(statusCodes.NOT_FOUND).json({
        success: "false",
        message: messages.USER_NOT_FOUND,
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(statusCodes.UNAUTHORIZED).json({
        success: "false",
        message: messages.INVALID_CREDENTIALS,
      });
    }
    const token = jwt.sign({ id: user._id }, serverConfig.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(statusCodes.OK).json({
      success: "true",
      message: messages.LOGIN_SUCCESS,
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: "false",
      error: error.message,
    });
  }
};

module.exports = {
  registerController,
  loginController,
};
