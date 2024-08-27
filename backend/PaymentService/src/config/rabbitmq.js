const amqp = require("amqplib");
const serverConfig = require("./serverConfig");
const rabbitMQEvents = require("../utils/rabbitMQEvents");

let channel, connection;

async function connectRabbitMQ() {
  try {
    connection = await amqp.connect(serverConfig.LOCALHOST);
    channel = await connection.createChannel();

    await channel.assertQueue(rabbitMQEvents.ORDERED_CREATED);
    await channel.assertQueue(rabbitMQEvents.PAYMENT_PROCESSED);

    channel.consume(rabbitMQEvents.ORDERED_CREATED, async (msg) => {
      const order = JSON.parse(msg.content.toString());

     // console.log("Received order:", order);

      // I Import here to avoid circular dependency
      const { processPayment } = require("../services/paymentProcessor");
      await processPayment(order);

      channel.ack(msg);
    });

    console.log(`[Payment Service] RabbitMQ connected and consumer set up.`.bgGreen.white);
  } catch (err) {
    console.error(
      `[Payment Service] Failed to connect to RabbitMQ: ${err.message}`.bgRed.white
    );
    process.exit(1);
  }
}

function getChannel() {
  if (!channel) {
    throw new Error("Channel not initialized. Call connectRabbitMQ first.");
  }
  return channel;
}

module.exports = { connectRabbitMQ, getChannel };
