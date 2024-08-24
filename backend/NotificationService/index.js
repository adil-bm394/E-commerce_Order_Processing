const express = require("express");
const { connectRabbitMQ } = require("./config/rabbitmq");

const app = express();
app.use(express.json());

// Start RabbitMQ connection
connectRabbitMQ();

const PORT = serverConfig.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Notification service is running on port ${PORT}`.bgGreen.white);
});
