const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  LOCALHOST: process.env.LOCALHOST,
  mail: process.env.mail,
  pass: process.env.pass,
};
