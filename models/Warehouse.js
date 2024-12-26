const mongoose = require(`mongoose`);

const warehouseSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },

  contactNumber: {
    type: String,
  },

  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `User`,
  },
});

module.exports = mongoose.model(`Warehouse`, warehouseSchema);
