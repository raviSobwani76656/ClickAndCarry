const Order = require("../models/Order");
const mongoose = require("mongoose");

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
      !orderItems ||
      !totalAmount ||
      !paymentStatus ||
      !paymentMethod ||
      !status ||
      !shippingAddress
    ) {
      return res
        .status(400)
        .json({ message: "Enter all the required Details" });
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
    return res.status(201).json({
      status: true,
      message: "Order Created Successfully",
      order: newOrder,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id);

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Enter the Valid Order Id" });
    }

    const orderTodelete = await Order.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ status: true, message: "Order Cancelled SuccessFully" });
  } catch (error) {
    console.log("Error Occured", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

module.exports = { cancelOrder, createOrder };
