const mongoose = require(`mongoose`);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  username: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: [`customer`, `admin`, `seller`],
    required: true,
    default: `customer`,
  },

  phoneNumber: {
    type: String,
    required: true,
  },

  gender: {
    type: String,
    enum: [`Male`, `Female`, `Other`],
    required: true,
  },

  birthdate: {
    type: Date,
    required: true,
  },

  address: {
    type: String,
  },

  orderHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: `Order`,
    },
  ],

  termsd: {
    type: Boolean,
    required: true,
    default: false,
  }
});

module.exports = mongoose.model(`User`, userSchema)
