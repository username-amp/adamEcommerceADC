const mongoose = require(`mongoose`);

const affiliateProgramSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  commissionRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },

  totalEarnings: {
    type: Number,
    default: 0,
  },

  referredUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: `User`,
    },
  ],
});

module.exports = mongoose.model(`AffiliateProgram`, affiliateProgramSchema);
