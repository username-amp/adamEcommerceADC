const mongoose = require(`mongoose`);

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    typ: String,
  },

  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `Category`,
  },
});

module.exports = mongoose.model(`Category`, categorySchema);
