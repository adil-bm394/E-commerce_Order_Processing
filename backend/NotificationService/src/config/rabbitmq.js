const amqp = require("amqplib");
const axios = require("axios"); 
const rabbitMQEvents = require("../utils/rabbitMQEvents");
const sendNotification = require("../services/notificationService");
const serverConfig = require("./serverConfig");
const getUserDetail = require("../utils/getUserDetails");

let channel, connection;

async function connectRabbitMQ() {
  try {
    connection = await amqp.connect(serverConfig.LOCALHOST);
    channel = await connection.createChannel();
    await channel.assertQueue(rabbitMQEvents.ORDERED_FULLFILLED);

    console.log(`Connected to RabbitMQ and queue asserted`.bgGreen.white);

    channel.consume(rabbitMQEvents.ORDERED_FULLFILLED, async (msg) => {
      if (msg !== null) {
        try {
          const order = JSON.parse(msg.content.toString());
          console.log("Received order fulfillment:", order);

           // =========  Get user details from Redis =============
          const userDetail = await getUserDetail(order.userId);
          // console.log("User details from Redis:", userDetail);

          //================= Fetch UserDetails from UserAuth Service ===========

          // const response = await axios.get(
          //   `${serverConfig.GET_USER_DETAIL_API}/${order.userId}`
          // );
          // console.log("Response from get API:", response.data);

        //==============================================================
          await sendNotification(userDetail, order.product);

          channel.ack(msg);
        } catch (error) {
          console.error(
            `[Notification Service] Error processing message : ${error.message}`.bgRed.white
          );
        }
      }
    });
  } catch (error) {
    console.error(
      `[Notification Service] Failed to connect to RabbitMQ: ${error.message}`
        .bgRed.white
    );
  }
}

module.exports = { connectRabbitMQ };
