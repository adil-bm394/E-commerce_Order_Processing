const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

const PaymentModel = mongoose.model("Payment", paymentSchema);

module.exports = PaymentModel ;
