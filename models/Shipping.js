const mongoose = require(`mongoose`);

const shippingSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `Order`,
    required: true,
    unique: true,
  },

  carrier: {
    type: String,
  },

  trackingNumber: {
    type: String,
  },

  status: {
    type: String,
    enum: [`in transit`, `delivered`],
  },
});

module.exports = mongoose.model(`Shipping`, shippingSchema);
