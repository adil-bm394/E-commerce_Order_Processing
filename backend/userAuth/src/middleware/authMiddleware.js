const jwt = require("jsonwebtoken");
const statusCodes = require("../utils/statusCodes");
const messages = require("../utils/messages");
const UserModel = require("../models/userModel");
const serverConfig = require("../config/serverConfig");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(statusCodes.UNAUTHORIZED).json({
      success: false,
      message: messages.TOKEN_MISSING,
    });
  }

  try {
    const decoded = jwt.verify(token, serverConfig.JWT_SECRET);
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(statusCodes.NOT_FOUND).json({
        success: false,
        message: messages.USER_NOT_FOUND,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(statusCodes.UNAUTHORIZED).json({
      success: false,
      message: messages.INVALID_TOKEN,
    });
  }
};

module.exports = authMiddleware;
