const mongoose = require("mongoose");

const fullfillmentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "pending",
  },
});

const FullfillmentModel = mongoose.model("Fullfillment", fullfillmentSchema);

module.exports = FullfillmentModel;
