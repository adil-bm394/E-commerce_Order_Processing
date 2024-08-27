const redisClient = require("../config/redis");
const { getChannel } = require("../config/rabbitmq");
const statusCodes = require("../utils/statusCodes");
const messages = require("../utils/messages");
const OrderModel = require("../models/orderModel");


//CREATE ORDER
const createOrderController = async (req, res) => {
  const { product, price, quantity } = req.body;
  const userId  = req.userId;

   if (!userId) {
     return res.status(statusCodes.UNAUTHORIZED).send({
       success: false,
       message: messages.USER_NOT_AUTHORIZED,
     });
   }

  const newOrder = new OrderModel({ product, price, quantity, userId });
  await newOrder.save();

  redisClient.setEx(newOrder._id.toString(), 3600, JSON.stringify(newOrder));

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
  
  const order = await OrderModel.findById(id);

  if (!order) {
    return res.status(statusCodes.NOT_FOUND).send({
      success: "false",
      message: messages.ORDER_NOT_FOUND,
    });
  }
  
   if (status !== undefined) order.status = status;

  await order.save();

  redisClient.setEx(order._id.toString(), 3600, JSON.stringify(order));

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