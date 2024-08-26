const PaymentModel = require("../models/paymentModel");
const redisClient = require("../config/redis");
const { getChannel } = require("./rabbitmq");
const rabbitMQEvents = require("../utils/rabbitMQEvents");


const processPayment = async (order) => {
  try {
    // Mock payment processing
    const paymentStatus = Math.random() > 0.2 ? "success" : "failure";
    const payment = new PaymentModel({
      orderId: order._id,
      status: paymentStatus,
    });
    await payment.save();

    // Cache payment in Redis
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
