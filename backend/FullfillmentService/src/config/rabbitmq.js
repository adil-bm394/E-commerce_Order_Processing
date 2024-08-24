const amqp = require("amqplib");
const colors = require("colors");
const axios = require("axios");
const redisClient = require("./radis");
const FullfillmentModel = require("../models/fullfillmentModel");
const serverConfig = require("./serverConfig");


let channel, connection;

const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(serverConfig.LOCALHOST);
    channel = await connection.createChannel();
    await channel.assertQueue("payment.processed");
    await channel.assertQueue("order.fulfilled");

    channel.consume("payment.processed", async (msg) => {
        console.log(msg)
      const payment = JSON.parse(msg.content.toString());

      console.log("Received payment:", payment);

      if (payment.status === "success") {
        try {
          // Fetch the order and update it
          const response = await axios.put(
            `${serverConfig.UPDATEORDER_API}/${payment.orderId}`,
            {
              status: "success",
            }
          );

          const order = response.data.order;
          //console.log("response from update api ", order);

          const fulfillment = new FullfillmentModel({
            orderId: order._id.toString(),
            status: "fulfilled",
          });
          await fulfillment.save();

          // Cache updated order in Redis
          await redisClient.setEx(
            order._id.toString(),
            3600,
            JSON.stringify(order)
          );

          // Publish fulfillment status to RabbitMQ
          channel.sendToQueue(
            "order.fulfilled",
            Buffer.from(JSON.stringify(order))
          );
        } catch (error) {
          console.error("[Fullfillment Service]Error updating order:", error.message);
        }
      }

      channel.ack(msg);
    });

    console.log(`RabbitMQ connected and consumer set up`.bgGreen.white);
  } catch (error) {
    console.error(
      `[Fulfillment Service] RabbitMQ connection error: ${error.message}`.bgRed
        .white
    );
    process.exit(1);
  }
};

module.exports = connectRabbitMQ;
