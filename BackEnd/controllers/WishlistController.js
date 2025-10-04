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
    console.error(error.stack);
    return sendError(res, 500, "Internal Server Error");
  }
};

const addItems = async (req, res) => {
  try {
    const { id } = req.params;

    const { product } = req.body;

    if (!product || !Array.isArray(product) || product.length === 0) {
      return sendError(res, 400, "Invalid product details");
    }
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, "Invalid Wishlist Id");
    }

    const wishlist = await Wishlist.findById(id);

    if (!wishlist) {
      return sendError(res, 404, "Wishlist not found");
    }

    wishlist.product.push(...product);

    await wishlist.save();

    return sendSuccess(res, 200, "Product added to a wishlist succesfully");
  } catch (error) {
    console.error(error.stack);
    return sendError(res, 500, "Internal Server Error");
  }
};

const removeItems = async (req, res) => {
  try {
    const { id } = req.params;
    const { product } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, "Invalid Id");
    }

    if (!product || !Array.isArray(product) || product.length === 0) {
      return sendError(res, 400, "Invalid product details");
    }

    const wishlist = await Wishlist.findById(id);

    if (!wishlist) {
      return sendError(res, 404, "Wishlist not found");
    }

    console.log(wishlist);

    wishlist.product = wishlist.product.filter(
      (item) => !product.includes(item.toString())
    );

    await wishlist.save();
  } catch (error) {
    console.error(error.stack);
    return sendError(res, 500, "Internal Server Error");
  }
};

const getWishlist = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, "Invalid Wishlist Id");
    }

    const wishlist = await Wishlist.findById(id).populate("product");
    if (!wishlist) {
      return sendError(res, 404, "Wishlist not found");
    }

    return sendSuccess(res, 200, "Wishlist fetched successfully", wishlist);
  } catch (error) {
    console.error(error.stack);
    return sendError(res, 500, "Internal Server Error");
  }
};

module.exports = { addToWishlist, addItems, getWishlist, removeItems };
