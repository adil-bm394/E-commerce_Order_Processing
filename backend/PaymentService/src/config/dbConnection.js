const mongoose = require("mongoose");
const color = require("colors");
const serverConfig = require("./serverConfig");

const connectDB = async () => {
  try {
    await mongoose.connect(serverConfig.MONGODB_URL);
    console.log(`Mongodb connected ${mongoose.connection.host}`.bgGreen.white);
  } catch (error) {
    console.log(`[Payment Service] MongoDb Server Issue ${error}`.bgRed.white);
  }
};
module.exports = connectDB;
