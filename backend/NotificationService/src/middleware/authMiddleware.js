const jwt = require("jsonwebtoken");
const statusCodes = require("../utils/statusCodes");
const messages = require("../utils/messages");
const serverConfig = require("../config/serverConfig");
const redisClient = require("../config/redis");

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

    const redisToken = await redisClient.get(`auth_token_${decoded.id}`);

    if (redisToken === token) {
      req.userId = decoded.userId;
      next();
    } else {
      res
        .status(statusCodes.UNAUTHORIZED)
        .json({ message: messages.INVALID_TOKEN });
    }
  } catch (error) {
    console.error(
      `[Order Processing in authMiddleware]Authentication error:${error}`.bgRed
        .white
    );
    return res.status(statusCodes.UNAUTHORIZED).json({
      success: false,
      message: messages.INVALID_TOKEN,
    });
  }
};

module.exports = authMiddleware;
