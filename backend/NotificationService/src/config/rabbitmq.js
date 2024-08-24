const amqp = require("amqplib");
const serverConfig = require("./serverConfig");

let channel, connection;

async function connectRabbitMQ() {
  try {
    connection = await amqp.connect(serverConfig.LOCALHOST);
    channel = await connection.createChannel();
    await channel.assertQueue("order.fulfilled");
    console.log("Connected to RabbitMQ and queue asserted.");

    channel.consume("order.fulfilled", async (msg) => {
      if (msg !== null) {
        const order = JSON.parse(msg.content.toString());
        console.log("Received order fulfillment:", order);

        // Notify the notification service
        require("../services/notificationService").sendNotification(order);

        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
  }
}

module.exports = { connectRabbitMQ };
