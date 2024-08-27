const express = require("express");
const colors = require("colors");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./src/config/dbConnection");
const serverConfig = require("./src/config/serverConfig");
const { connectRabbitMQ } = require("./src/config/rabbitmq");


const app = express();
app.use(cors());

//Mongodb Connection
connectDB();

//middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

connectRabbitMQ()


const PORT = serverConfig.PORT || 3002;
app.listen(PORT, async () => {
  console.log(`Payment Processing is running on Port ${PORT}`.bgCyan.white);
});
