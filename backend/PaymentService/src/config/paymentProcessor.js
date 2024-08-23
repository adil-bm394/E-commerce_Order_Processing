const PaymentModel = require("../models/paymentModel");
const redisClient = require("../config/redis");
const { getChannel } = require("./rabbitmq");


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

    // Publish payment status to RabbitMQ
    const channel = getChannel();
    
    if (channel) {
      console.log("chhc")
      channel.sendToQueue(
        "payment.processed",
        Buffer.from(JSON.stringify(payment))
      );
      console.log("Payment processed and saved:", payment);
    } else {
      console.error("[Payment Service] RabbitMQ channel is not initialized");
    }
  } catch (error) {
    console.error("[Payment Service] Error processing payment:", error.message);
  }
};

module.exports = { processPayment };
