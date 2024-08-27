const userModel = require("../models/userModel");
const messages = require("../utils/messages");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const serverConfig = require("../config/serverConfig");
const { default: _enum } = require("../utils/rabbitMQEvents");
const { getChannel } = require("../config/rabbitmq");
const UserModel = require("../models/userModel");
const statusCodes = require("../utils/statusCode");
const rabbitMQEvents = require("../utils/rabbitMQEvents");
const redisClient = require("../config/redis");

//RegisterController
const registerController = async (req, res) => {
  const { name, email, password } = req.body;
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
    });

    res.status(statusCodes.CREATED).json({
      success: true,
      message: messages.REGISTER_SUCCESS,
      user: newUser,
    });
  } catch (error) {
    console.log(`[UserAuth Service] error in RegisterController ${error}`);
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
        success: false,
        message: messages.USER_NOT_FOUND,
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(statusCodes.UNAUTHORIZED).json({
        success: false,
        message: messages.INVALID_CREDENTIALS,
      });
    }
    const token = jwt.sign({ id: user._id }, serverConfig.JWT_SECRET, {
      expiresIn: "1d",
    });

    await redisClient.set(`auth_token_${user._id}`, token, { EX: 3600 });

    res.status(statusCodes.OK).json({
      success: true,
      message: messages.LOGIN_SUCCESS,
      token,
      user,
    });

   const userData =({
     email: user.email,
     name: user.name,
   });
    redisClient.setEx(user._id.toString(), 3600, JSON.stringify(userData));

    const channel = getChannel();

    if (channel) {
      const msg = JSON.stringify({
        userData,
      });

      channel.sendToQueue(rabbitMQEvents.USER_CREATED, Buffer.from(msg));
      // console.log("User Login message sent to RabbitMQ");
    }
  } catch (error) {
    console.log(`[UserAuth Service] error in LoginController ${error}`);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
    });
  }
};

//Get user Detail By ID
const getUserByIdController = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res
        .status(statusCodes.BAD_REQUEST)
        .json({ message: messages.USER_ID_REQUIRED });
      return;
    }

    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      res
        .status(statusCodes.NOT_FOUND)
        .json({ message: messages.USER_NOT_FOUND });
      return;
    }

    res.status(statusCodes.OK).json({
      success: true,
      message: messages.GET_USER_DETAILS,
      user,
    });
  } catch (error) {
    console.log(`[userAuth Service] error in getUserByIdController ${error}`);
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
