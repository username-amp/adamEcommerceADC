const mongoose = require(`mongoose`);

const productSchema = new mongoose.Schema(
  {
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

    solds: {
      type: Number,
      min: 0,
      default: 0,
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

    ratings: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
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

    // new fields

    hasWarranty: {
      type: Boolean,
      default: false,
    },

    warrantyType: {
      type: String,
    },

    warrantyDuration: {
      type: String,
    },

    shipsFrom: {
      type: String,
    },

    testimonials: [
      {
        username: String,
        location: String,
        created_at: Date,
        testimonial: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model(`Product`, productSchema);
