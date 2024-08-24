const userModel = require("../models/userModel");
const messages = require("../utils/messages");
const statusCodes = require("../utils/statusCodes");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const serverConfig = require("../config/serverConfig");
const { default: _enum } = require("../utils/enum");
const { getChannel } = require("../config/rabbitmq");
const UserModel = require("../models/userModel");

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

    const channel = getChannel();

    if (channel) {
      const msg = JSON.stringify({ userId: user.userId, email: user.email });
      channel.sendToQueue(_enum.USER_CREATED, Buffer.from(msg));
      console.log("User created message sent to RabbitMQ");
    }

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

    await redisClient.set(`auth_token_${user._id}`, token, { EX: 3600 });

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

const getUserByIdController = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res
        .status(statusCodes.BAD_REQUEST)
        .json({ message: messages.USER_ID_REQUIRED });
      return;
    }

    const user = await UserModel.findOne({ userId });
    if (!user) {
      res
        .status(statusCodes.NOT_FOUND)
        .json({ message: messages.USER_NOT_FOUND });
      return;
    }

    res.status(statusCodes.OK).json({
      success: "true",
      message: messages.GET_USER_DETAILS,
      user,
    });
  } catch (error) {
    res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: messages.INTERNAL_SERVER_ERROR, error });
  }
};

module.exports = {
  registerController,
  loginController,
  getUserByIdController,
};
