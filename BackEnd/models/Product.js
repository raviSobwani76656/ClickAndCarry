const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    images: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
