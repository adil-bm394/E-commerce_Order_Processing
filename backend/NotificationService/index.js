const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const colors = require("colors");
const serverConfig = require("./src/config/serverConfig");
const { connectRabbitMQ } = require("./src/config/rabbitmq");

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// Start RabbitMQ connection
connectRabbitMQ();

const PORT = serverConfig.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Notification service is running on port ${PORT}`.bgGreen.white);
});
