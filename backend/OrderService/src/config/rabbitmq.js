const amqp = require("amqplib");
const colors = require("colors");
const serverConfig = require("./serverConfig");
const rabbitMQEvents = require("../utils/rabbitMQEvents");

let channel, connection;

async function connectRabbitMQ() {
  try {
    connection = await amqp.connect(serverConfig.LOCALHOST);
    channel = await connection.createChannel();
    await channel.assertQueue(rabbitMQEvents.USER_CREATED);

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
