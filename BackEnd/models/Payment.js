const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    /*A PaymentIntent is a Stripe object that represents a single payment attempt.
    It contains all the information Stripe needs to process a payment: amount, currency, 
    customer info, metadata, and payment method.*/
    stripePaymentIntent: {
      type: String,
      required: true,
    },
    paymentAmount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "failed", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "cash", "debit_card", "upi", "internet_banking"],
      required: true,
    },
    metaData: {
      type: Object, //This is an optional object where we store extra info related to the payment.
    },
    receiptURL: {
      type: String,
      default: null,
    },

    failureMessage: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
