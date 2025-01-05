const mongoose = require(`mongoose`);

const marketingEmailSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `User`,
    required: true,
  },

  subject: {
    type: String,
    required: true,
  },

  content: {
    type: String,
    required: true,
  },

  sentDate: {
    type: Date,
    default: Date.now,
  },

  status: {
    type: String,
    enum: [`delivered`, `bounced`, `opened`, `returned`],
  },
});

module.exports = mongoose.model(`MarketingEmail`, marketingEmailSchema);
