const express = require("express");
const { createOrderController, getOrderController, updateOrderController } = require("../controllers/orderController");

const router = express.Router();


router.post("/createOrder", createOrderController);
router.get("/getOrder/:id", getOrderController);
router.put("/updateOrders/:id", updateOrderController);

module.exports = router;
