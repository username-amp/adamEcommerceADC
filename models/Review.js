const mongoose = require(`mongoose`);

const reviewSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `User`,
    required: true,
  },

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `Product`,
    required: true,
  },

  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },

  comment: {
    type: String,
  },

  reviewDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(`Review`, reviewSchema);
