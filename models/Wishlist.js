const mongoose = require(`mongoose`);

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `User`,
    required: true,
    unique: true,
  },

  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: `Product`,
    },
  ],
});

module.exports = mongoose.model(`Wishlist`, wishlistSchema);
