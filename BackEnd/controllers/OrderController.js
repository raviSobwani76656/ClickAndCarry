const Order = require("../models/Order");
const mongoose = require("mongoose");
const { sendError, sendSuccess } = require("../utils/response");

const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      totalAmount,
      paymentStatus,
      paymentMethod,
      status,
      shippingAddress,
    } = req.body;

    const userId = req.user.id;

    if (
      !userId ||
      !Array.isArray(orderItems) || // orderItems is not an array
      orderItems.length === 0 || //orderItems is a empty array
      typeof totalAmount !== "number" || // totalAmount is not a number
      totalAmount <= 0 || //OR less than/equal to 0
      !paymentStatus ||
      !paymentMethod ||
      !status ||
      !shippingAddress
    ) {
      return sendError(res, 400, "Enter Valid Information");
    }

    const newOrder = new Order({
      userId,
      orderItems,
      totalAmount,
      paymentStatus,
      paymentMethod,
      status,
      shippingAddress,
    });

    await newOrder.save();
    return sendSuccess(res, 201, "Ordered Created Successfully");
  } catch (error) {
    console.error(error.stack);
    return sendError(res, 500, "Internal Server Error");
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, "Enter valid id");
    }

    const orderToCancel = await Order.findByIdAndDelete(id);

    if (!orderTodelete) {
      return sendError(res, 404, "Order not found");
    }

    orderToCancel.status = "cancelled";

    await orderToCancel.save();

    return sendSuccess(res, 200, "Ordered Cancelled Succesfully");
  } catch (error) {
    console.error(error.stack);
    return sendError(res, 500, "Internal Server Error");
  }
};

module.exports = { createOrder, cancelOrder };
