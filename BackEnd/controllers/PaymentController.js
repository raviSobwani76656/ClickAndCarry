const Payment = require("../models/Payment");
const paymentService = require("../services/stripeService");
const { sendError, sendSuccess } = require("../utils/response");

const createPayment = async (req, res) => {
  try {
    const { orderId, userId } = req.body;

    if (!orderId || !userId) {
      return sendError(res, 400, "Enter Valid orderId and userId");
    }

    const createPaymentIntent = await paymentService.createPayment(
      orderId,
      userId
    );

    return sendSuccess(
      res,
      201,
      "Payment Created Successfully",
      createPaymentIntent
    );
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Internal Server Error");
  }
};

const getPaymentIntent = async (req, res) => {
  try {
    const { paymentIntentID } = req.params;

    if (!paymentIntentID)
      return sendError(res, 400, "Enter Valid Payment Intent ID");
    const paymentIntent = await paymentService.retrievePaymentIntent(
      paymentIntentID
    );

    return sendSuccess(
      res,
      200,
      "Payment Intent retrieved Successfully",
      paymentIntent
    );
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Internal Server Error");
  }
};

const paymentRefund = async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    console.log(req.body);

    if (!orderId) {
      return sendError(res, 400, "Enter valid OrderId");
    }

    const refund = await paymentService.createRefund(orderId, amount);

    return sendSuccess(res, 200, "Payment Returned Successfully", refund);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Internal Server Error");
  }
};

module.exports = { createPayment, getPaymentIntent, paymentRefund };
