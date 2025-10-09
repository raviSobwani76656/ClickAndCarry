const stripe = require("../config/Stripe");
const Order = require("../models/Order");
const Payment = require("../models/Payment");

class paymentService {
  async createPayment(orderId, userId) {
    try {
      const order = await Order.findById(orderId).populate("items.product");

      if (!order) {
        throw new Error("Order not found");
      }

      if (order.paymentMethod === "paid") {
        throw new Error("Order payment is already paid");
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(order.totalAmount * 100),
        currency: order.currency.toLowerCase(),
        metadata: { orderId, userId },
        automatic_payment_methods: { enabled: true },
        description: `Order ${order._id}`,
      });

      order.stripePaymentIntent = paymentIntent.id;
      await order.save();

      await Payment.create({
        order: order._id,
        stripePaymentIntentId: paymentIntent.id,
        amount: order.totalAmount,
        currency: order.currency,
        status: "pending",
      });

      return {
        clientSecret: paymentIntent.client_secret.toString(),
        paymentIntent: paymentIntent.id.toString(),
      };
    } catch (error) {
      throw new Error(`Erro Occured while creating payment ${error.message}`);
    }
  }
}
