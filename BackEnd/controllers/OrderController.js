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
    return sendSuccess(res, 201, "Ordered Created Successfully", newOrder);
  } catch (error) {
    console.error(error.stack);
    return sendError(res, 500, "Internal Server Error");
  }
};

const getAllOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return sendError(res, 400, "Enter valid Userid");
    }

    const orders = await Order.find({ userId });

    if (!Array.isArray(orders) || orders.length === 0) {
      return sendError(res, 404, "Orders not found");
    }

    return sendSuccess(res, 200, "Orders fetched successfully", orders);
  } catch (error) {
    console.error(error.stack);
    return sendError(res, 500, "Internal server Error");
  }
};

const getSingleOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, "Enter Valid Id");
    }

    const singleOrder = await Order.findById(id).populate(
      "orderItems.productId",
      "productItems price"
    );

    if (!singleOrder) {
      return sendError(res, 404, "Order not found");
    }

    return sendSuccess(res, 200, "Order fetched Successfully", singleOrder);
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

    const orderToCancel = await Order.findById(id);

    if (!orderToCancel) {
      return sendError(res, 404, "Order not found");
    }

    if (orderToCancel.status === "cancelled") {
      return sendError(res, 400, "Order already Cancelled");
    }

    orderToCancel.status = "cancelled";
    orderToCancel.cancelledAt = Date.now();

    await orderToCancel.save();

    return sendSuccess(res, 200, "Ordered Cancelled Succesfully");
  } catch (error) {
    console.error(error.stack);
    return sendError(res, 500, "Internal Server Error");
  }
};

module.exports = { createOrder, cancelOrder, getAllOrders, getSingleOrder };
