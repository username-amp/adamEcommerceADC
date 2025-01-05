const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },

  discountPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },

  startDate: {
    type: Date,
    required: true,
  },

  endDate: {
    type: Date,
    required: true,
  },

  usageCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model(`Discount`, discountSchema);
