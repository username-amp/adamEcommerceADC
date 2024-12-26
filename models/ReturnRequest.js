const mongoose = require(`mongoose`);

const returnRequestSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `Order`,
    required: true,
  },

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `Product`,
    required: true,
  },

  reason: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: [`pending`, `approved`, `rejected`],
    default: `pending`,
  },

  returnDate: {
    type: Date,
  },

  refundAmount: {
    type: Number,
  },
});

module.exports = mongoose.model(`ReturnRequest`, returnRequestSchema);
