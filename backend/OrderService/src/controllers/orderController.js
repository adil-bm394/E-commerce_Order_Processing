const redisClient = require("../config/redis");
const { getChannel } = require("../config/rabbitmq");
const statusCodes = require("../utils/statusCodes");
const messages = require("../utils/messages");
const OrderModel = require("../models/orderModel");


//CREATE ORDER
const createOrderController = async (req, res) => {
  const { product, quantity } = req.body;

  const newOrder = new OrderModel({ product, quantity});
  await newOrder.save();

  // Cache order in Redis
  redisClient.setEx(newOrder._id.toString(), 3600, JSON.stringify(newOrder));

  // Publish to RabbitMQ
  const channel = getChannel();
  if (channel) {
    channel.sendToQueue("order.created", Buffer.from(JSON.stringify(newOrder)));
  } else {
    console.error("[Order Service]RabbitMQ channel is not initialized");
  }

  res.status(statusCodes.CREATED).send({
    success:'true',
    message: messages.ORDER_CREATED,
    newOrder
  });
};


//GET ALL ORDER
const getOrderController = async (req, res) => {
  const { id } = req.params;

  // Check Redis cache first
  const cachedOrder = await redisClient.get(id);
  if (cachedOrder) {
    return res.send(JSON.parse(cachedOrder));
  }

  const order = await OrderModel.findById(id);
  if (!order) {
    return res.status(statusCodes.NOT_FOUND).send({ 
      success:'false',
      message: messages.ORDER_NOT_FOUND
    });
  }

  // Cache order in Redis
  redisClient.setEx(order._id.toString(), 3600, JSON.stringify(order));

  res.status(statusCodes.OK).send({
    success:'true',
    message: messages.ORDER_FETCHED,
    order
  });
};


//UPDATE ORDER 
const updateOrderController = async (req, res) => {
  const { id } = req.params;
  const { product, status } = req.body;

  // Find the order by ID
  const order = await OrderModel.findById(id);

  if (!order) {
    return res.status(statusCodes.NOT_FOUND).send({
      success: "false",
      message: messages.ORDER_NOT_FOUND,
    });
  }

  // order.status = "success";
  
  // // Update the order fields
  // if (product !== undefined) order.product = product;
  // if (status !== undefined) order.status = status;

  // Save the updated order
  await order.save();

  // Update the cache in Redis
  redisClient.setEx(order._id.toString(), 3600, JSON.stringify(order));

  // Publish updated order status to RabbitMQ
  const channel = getChannel();
  if (channel) {
    channel.sendToQueue("order.updated", Buffer.from(JSON.stringify(order)));
  } else {
    console.error("[Order Service] RabbitMQ channel is not initialized");
  }

  res.status(statusCodes.OK).send({
    success: "true",
    message: messages.ORDER_UPDATED,
    order,
  });
};

module.exports = {
  createOrderController,
  getOrderController,
  updateOrderController,
};