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
  },

  birthdate: {
    type: Date,
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
  },

  // New fields for OTP verification
  verificationCode: {
    type: String, // Store the OTP
  },
  verificationCodeExpiry: {
    type: Date, // Store the expiry timestamp for the OTP
  },
});

module.exports = mongoose.model(`User`, userSchema);
