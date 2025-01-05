const mongoose = require(`mongoose`);

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  price: {
    type: Number,
    required: true,
    min: 0,
  },

  images: {
    type: [String],
    required: true,
  },

  stock: {
    type: Number,
    min: 0,
    default: 0,
  },

  sizes: {
    type: [String],
  },

  tags: {
    type: [String],
    enum: [
      "bestseller",
      "hot_sales",
      "new_arrival",
      "sale",
      "featured",
      "limited_edition",
      "organic",
      "sustainable",
      "handmade",
    ],
  },
});

module.exports = mongoose.model(`Product`, productSchema);
