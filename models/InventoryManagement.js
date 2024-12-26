const mongoose = require(`mongoose`);

const inventoryManagementSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `Product`,
    required: true,
  },

  warehouseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `Warehouse`,
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
    min: 0,
  },

  lastRestocked: {
    type: Date,
  },
});

module.exports = mongoose.model(
  `InventoryManagement`,
  inventoryManagementSchema
);
