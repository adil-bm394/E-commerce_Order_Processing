const amqp = require("amqplib");
const serverConfig = require("./serverConfig");

let channel, connection;

async function connectRabbitMQ() {
  try {
    connection = await amqp.connect(serverConfig.LOCALHOST);
    channel = await connection.createChannel();

    await channel.assertQueue("order.created");
    await channel.assertQueue("payment.processed");

    channel.consume("order.created", async (msg) => {
      const order = JSON.parse(msg.content.toString());

      console.log("Received order:", order);

      // Import here to avoid circular dependency
      const { processPayment } = require("./paymentProcessor");
      await processPayment(order);

      channel.ack(msg);
    });

    console.log(`[Payment Service] RabbitMQ connected and consumer set up.`.bgGreen.red);
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
