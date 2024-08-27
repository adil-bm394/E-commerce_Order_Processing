const PaymentModel = require("../models/paymentModel");
const redisClient = require("../config/redis");
const { getChannel } = require("../config/rabbitmq");
const rabbitMQEvents = require("../utils/rabbitMQEvents");
const messages = require("../utils/messages");


const processPayment = async (order) => {
  try {
  
    const paymentStatus = Math.random() > 0.2 ? messages.SUCCESS : messages.FAILURE;
    const payment = new PaymentModel({
      orderId: order._id,
      status: paymentStatus,
    });
    await payment.save();

    redisClient.setEx(payment._id.toString(), 3600, JSON.stringify(payment));

    const channel = getChannel();
    
    if (channel) {
      channel.sendToQueue(
        rabbitMQEvents.PAYMENT_PROCESSED,
        Buffer.from(JSON.stringify(payment))
      );
      console.log("Payment processed and saved:", payment);
    } else {
      console.error(`[Payment Service] RabbitMQ channel is not initialized`.bgRed.white);
    }
  } catch (error) {
    console.error(`[Payment Service] Error processing payment: ${error.message}`.bgRed.white);
  }
};

module.exports = { processPayment };
