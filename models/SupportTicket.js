const mongoose = require(`mongoose`);

const supportTicketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `User`,
    required: true,
  },

  subject: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: [`open`, `in progress`, `resolved`],
    default: `open`,
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },

  resolvedDate: {
    type: Date,
  },
});

module.exports = mongoose.model(`SupportTicket`, supportTicketSchema);
