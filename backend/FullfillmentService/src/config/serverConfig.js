const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  MONGODB_URL: process.env.MONGODB_URL,
  LOCALHOST: process.env.LOCALHOST,
  UPDATEORDER_API:process.env.UPDATEORDER_API
};
