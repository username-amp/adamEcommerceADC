const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "shipped", "delivered"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["cashOnDelivery", "onlinePayment", "creditCard", "debitCard"],
    required: true,
  },
  shippingAddress: {
    type: String,
    required: true,
  },
  shippingMethod: {
    type: String,
    enum: ["standardShipping", "expressShipping", "overnightShipping"],
  },
});

module.exports = mongoose.model("Order", orderSchema);
