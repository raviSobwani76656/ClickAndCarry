const stripe = require("../config/Stripe");
const { findOneAndUpdate } = require("../models/Discount");
const Order = require("../models/Order");
const Payment = require("../models/Payment");

class paymentService {
  async createPayment(orderId, userId) {
    try {
      const order = await Order.findById(orderId).populate("orderItems");

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

      console.log(paymentIntent);

      order.StripePaymentIntentID = paymentIntent.id;
      await order.save();

      console.log("Updating payment Schema");

      await Payment.create({
        order: order._id,
        stripePaymentIntent: paymentIntent.id,
        paymentAmount: order.totalAmount,
        paymentMethod: order.paymentMethod || "credit_card",
        currency: order.currency,
        status: "pending",
      });

      console.log("Payment Saved succesfully");

      return {
        clientSecret: paymentIntent.client_secret.toString(),
        paymentIntent: paymentIntent.id.toString(),
      };
    } catch (error) {
      throw new Error(`Erro Occured while creating payment ${error.message}`);
    }
  }
  async retrievePaymentIntent(paymentIntentId) {
    try {
      return await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      throw new Error(
        `Error occured while retrieving the payment Intent ${error.message}`
      );
    }
  }

  async handleSuccessfullPayment(paymentIntentId) {
    try {
      const order = await Order.findOne({
        StripePaymentIntentID: paymentIntentId,
      });

      if (!order) {
        throw new Error("Order not found");
      }

      if (order.paymentStatus === "paid") {
        throw new Error("Order is already Paids");
      }

      order.paymentStatus = "paid";
      order.status = "pending";
      await order.save();

      await Payment.findOneAndUpdate(
        { StripePaymentIntentID: paymentIntentId },
        {
          $set: {
            paymentStatus: "paid",
            receiptURL: await this.getReceiptURl(paymentIntentId),
          },
        }
      );

      return order;
    } catch (error) {
      throw new Error(
        `Error Occured while handling success Payment${error.message}`
      );
    }
  }

  async getReceiptURl(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );

      if (paymentIntent.charges.data.length > 0) {
        return paymentIntent.charges.data[0].receipt_url;
      }
      return null;
    } catch (error) {
      throw new Error(
        `Error Occured while retrieving the receipt ${error.message}`
      );
    }
  }

  async createRefund(orderId, amount = null) {
    try {
      const order = await Order.findById(orderId);

      if (!order || !order.StripePaymentIntentID) {
        throw new Error(
          "Order not present or StripePayment Intent Id not present"
        );
      }
      const refundData = {
        payment_intent: order.StripePaymentIntentID,
      };

      if (amount) {
        refundData.amount = Math.round(amount * 100);
      }

      const refund = await stripe.refunds.create(refundData);

      order.paymentStatus = "refunded";
      order.status = "refunded";
      await order.save();

      return refund;
    } catch (error) {
      throw new Error(`Error Occured while creating a refund ${error.message}`);
    }
  }
}
module.exports = new paymentService();
