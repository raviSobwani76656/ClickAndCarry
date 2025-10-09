const Payment = require("../models/Payment");
const paymentService = require("../services/stripeService");
const { sendError } = require("../utils/response");

const createPayment = async (req, res) => {
  try {
    const { orderId, userId } = req.body;

    if (!orderId || !userId) {
      return sendError(res, 400, "Enter Valid orderId and userId");
    }

    const createPaymentIntent = await paymentService(orderId, userId);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Internal Server Error");
  }
};

module.exports = { createPayment };
