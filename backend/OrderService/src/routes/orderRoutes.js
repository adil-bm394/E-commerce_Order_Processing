const express = require("express");
const { createOrderController, getOrderController, updateOrderController } = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const { orderValidationRules } = require("../utils/validationSchema");

const router = express.Router();


router.post("/createOrder",orderValidationRules, authMiddleware,createOrderController);
router.get("/getOrder/:id",authMiddleware, getOrderController);
router.put("/updateOrderStatus/:id", updateOrderController);

module.exports = router;
