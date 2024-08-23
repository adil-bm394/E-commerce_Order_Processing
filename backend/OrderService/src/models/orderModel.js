const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  product: {
    type: String,
    required:true
  },
  quantity:
  {
    type: Number,
    required:true
  } ,
  status:
  {
    type:String,
    required:true,
    default:'created'

  } 
},
{timestamps:true}
);

const OrderModel = mongoose.model("Order", orderSchema);

module.exports = OrderModel;
