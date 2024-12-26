const mongoose = require(`mongoose`);

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `User`,
    required: true,
  },

  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `Order`,
    require: True,
    unique: true,
  },

  amountPaid: {
    type: Number,
    require: true,
    min: 0,
  },

  paymentDate: {
    type: Date,
    default: Date.now,
  },

  status: {
    type: String,
    enum: [`success`, `failed`, `pending`],
    default: `pending`,
  },
});

module.exports = mongoose.model(`Payment`, paymentSchema);
