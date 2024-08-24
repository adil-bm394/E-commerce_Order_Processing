const express = require("express");
const { createOrderController, getOrderController, updateOrderController } = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/createOrder", authMiddleware,createOrderController);
router.get("/getOrder/:id",authMiddleware, getOrderController);
router.put("/updateOrders/:id",authMiddleware, updateOrderController);

module.exports = router;
