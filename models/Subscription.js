const mongoose = require(`mongoose`);

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `User`,
    required: true,
    unique: true,
  },

  planType: {
    type: String,
    enum: [`free`, `premium`],
    required: true,
    default: `free`,
  },

  startDate: {
    type: Date,
    default: Date.now,
  },

  endDate: {
    type: Date,
  },

  status: {
    type: String,
    enum: [`active`, `expired`, `cancelled`],
    default: `active`,
  },
});

module.exports = mongoose.model(`Subscription`, subscriptionSchema);
