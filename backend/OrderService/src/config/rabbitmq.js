const amqp = require("amqplib");
const colors = require("colors");
const serverConfig = require("./serverConfig");

let channel, connection;

async function connectRabbitMQ() {
  try {
    connection = await amqp.connect(serverConfig.LOCALHOST);
    channel = await connection.createChannel();
    await channel.assertQueue("order.created");

    console.log(`[Order Processing] Connected to RabbitMQ`.bgGreen.white);
  } catch (error) {
    console.error(
      `[Order Processing] RabbitMQ connection error: ${error.message}`.bgRed
        .white
    );
  }
}

connectRabbitMQ();

module.exports = { getChannel: () => channel, connection };
