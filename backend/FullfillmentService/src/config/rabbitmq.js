const amqp = require("amqplib");
const colors = require("colors");
const axios = require("axios");
const redisClient = require("./radis");
const FullfillmentModel = require("../models/fullfillmentModel");
const serverConfig = require("./serverConfig");
const rabbitMQEvents = require("../utils/rabbitMQEvents");

let channel, connection;

const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(serverConfig.LOCALHOST);
    channel = await connection.createChannel();
    await channel.assertQueue(rabbitMQEvents.PAYMENT_PROCESSED);
    await channel.assertQueue(rabbitMQEvents.ORDER_FULLFILLED);

    channel.consume(rabbitMQEvents.PAYMENT_PROCESSED, async (msg) => {
      const payment = JSON.parse(msg.content.toString());

      console.log("Received payment:", payment);

      if (payment.status === "success") {
        try {
          const response = await axios.put(
            `${serverConfig.UPDATEORDER_API}/${payment.orderId}`,
            {
              status: "success",
            }
          );

          const order = response.data.order;
          console.log("response from update api ", order);

          const fulfillment = new FullfillmentModel({
            orderId: order._id.toString(),
            status: "fulfilled",
          });
          await fulfillment.save();

          await redisClient.setEx(
            order._id.toString(),
            3600,
            JSON.stringify(order)
          );

          channel.sendToQueue(
            rabbitMQEvents.ORDER_FULLFILLED,
            Buffer.from(JSON.stringify(order))
          );
        } catch (error) {
          console.error(
            "[Fullfillment Service]Error updating order :",
            error.message
          );
        }
      }

      channel.ack(msg);
    });

    console.log(
      `[Fullfillment Service]RabbitMQ connected and consumer set up`.bgGreen
        .white
    );
  } catch (error) {
    console.error(
      `[Fulfillment Service] RabbitMQ connection error: ${error.message}`.bgRed
        .white
    );
    process.exit(1);
  }
};

module.exports = connectRabbitMQ;
