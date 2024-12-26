const mongoose = required(`mongoose`);

const giftCardSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },

  balance: {
    type: Number,
    required: true,
    min: 0,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `User`,
  },

  expiryDate: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model(`GiftCard`, giftCardSchema);
