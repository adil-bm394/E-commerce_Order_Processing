const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/dbConnection");
const serverConfig = require("./src/config/serverConfig");
const { connectRabbitMQ } = require("./config/rabbitmq");


dotenv.config();
const app = express();
app.use(cors());

//Mongodb Connection
connectDB();

//middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());


//Routes
app.use("/api/v1", require("./routes/authRoutes"));


connectRabbitMQ();

const PORT = serverConfig.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`.bgGreen.white);
});
