const mongoose = require(`mongoose`);

const loyaltyProgramSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `User`,
    required: true,
    unique: true,
  },

  points: {
    type: Number,
    default: 0,
    min: 0,
  },

  redeemedPoints: {
    type: Number,
    default: 0,
    min: 0,
  },

  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(`LoyaltyProgram`, loyaltyProgramSchema);
