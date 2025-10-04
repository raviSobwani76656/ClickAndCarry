const Wishlist = require("../models/Wishlist");
const { sendError, sendSuccess } = require("../utils/response");
const mongoose = require("mongoose");

const addToWishlist = async (req, res) => {
  try {
    const { product, name, isPublic } = req.body;
    const id = req.user.id;

    if (!id) return sendError(res, 401, "User not authenticated");

    if (!name) return sendError(res, 400, "Wishlist name is required");
    if (!product || !Array.isArray(product) || product.length === 0)
      return sendError(res, 400, "Product must be a non-empty array of IDs");

    // Validate product IDs
    if (!product.every((p) => mongoose.Types.ObjectId.isValid(p))) {
      return sendError(res, 400, "Invalid product IDs in array");
    }

    const existingWishlist = await Wishlist.findOne({ name, user: id });
    if (existingWishlist)
      return sendError(res, 400, "Wishlist already exists for this user");

    const newWishlist = new Wishlist({
      user: id,
      product,
      name,
      isPublic: isPublic || false,
    });

    await newWishlist.save();

    return sendSuccess(res, 201, "New Wishlist Created", newWishlist);
  } catch (error) {
    console.error("Error in addToWishlist:", error);
    return sendError(res, 500, "Internal Server Error");
  }
};

module.exports = { addToWishlist };
