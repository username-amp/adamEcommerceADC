const mongoose = require(`mongoose`);

const auditLogSchema = new mongoose.Schema({
  actionType: {
    type: String,
    required: true,
  },

  performBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `User`,
  },

  detailes: {
    type: Object,
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(`AuditLog`, auditLogSchema);
