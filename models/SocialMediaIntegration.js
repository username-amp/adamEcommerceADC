const mongoose = require("mongoose");

const socialMediaIntegrationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  platform: {
    type: String,
    enum: ["Facebook", "Twitter", "Instagram", "Other"],
  },
  action: {
    type: String,
    enum: ["like", "share", "comment", "follow"],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "SocialMediaIntegration",
  socialMediaIntegrationSchema
);
