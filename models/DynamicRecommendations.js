const mongoose = require("mongoose");

const dynamicRecommendationsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  generatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "DynamicRecommendations",
  dynamicRecommendationsSchema
);
