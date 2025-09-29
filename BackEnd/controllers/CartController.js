const Cart = require("../models/Cart");
const { sendError, sendSuccess } = require("../utils/response");

const addItems = async (req, res) => {
  try {
    const { cartItems, totalAmount } = req.body;
    const userId = req.user.id;

    if (
      !userId ||
      !Array.isArray(cartItems) ||
      cartItems.length === 0 ||
      !totalAmount
    ) {
      return sendError(res, 400, "Enter Valid information");
    }

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { cartItems, totalAmount },
      {
        new: true, // Return the updated cart instead of the old one And
        upsert: true, // Create a new document if none exists that matches the filter
        runValidators: true, //Enforces schema validation on the update
      }
    );

    return sendSuccess(res, 201, "Cart Created successfully");
  } catch (error) {
    console.error("Error in addOrUpdateCart:", error);
    return sendError(res, 500, "Internal server error");
  }
};

const updateCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const { cartItems, totalAmount } = req.body;

    if (
      !userId ||
      !Array.isArray(cartItems) ||
      cartItems.length === 0 ||
      totalAmount <= 0
    ) {
      return sendError(res, 400, "Enter Valid Information");
    }

    const requiredCart = await Cart.findOne({ userId });

    if (!requiredCart) {
      return sendError(res, 404, "Cart not found");
    }
    requiredCart.cartItems = cartItems;
    requiredCart.totalAmount = totalAmount;

    await requiredCart.save();

    return sendSuccess(res, 200, "cart updated successfully");
  } catch (error) {
    console.log(error.stack);
    return sendError(res, 500, "Internal server error");
  }
};

const emptyCart = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return sendError(res, 400, "Enter Valid Id");
    }

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { cartItems: [], totalAmount: 0 },
      { new: true }
    );

    if (!cart) {
      return sendError(res, 404, "Card does not exists");
    }

    return sendSuccess(res, 200, "Cart emptied successfully", cart);
  } catch (error) {
    console.log(error.stack);
    return sendError(res, 500, "Internal server error");
  }
};

module.exports = { addItems, emptyCart, updateCart };
