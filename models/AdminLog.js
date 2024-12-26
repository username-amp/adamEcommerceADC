const mongoose = require(`mongoose`);

const adminLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
  },

  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `User`,
    required: true,
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(`AdminLog`, adminLogSchema);
