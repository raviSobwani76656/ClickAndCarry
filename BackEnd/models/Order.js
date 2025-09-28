const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    orderItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productQuantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "debit_card", "credit_card", "upi", "internet_banking"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },

  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

// Virtuals in Mongoose are fields that are **not stored in MongoDB** but are computed dynamically
// They are useful when you want a value derived from existing data without saving it in the database.

orderSchema.virtual("calculatedTotal").get(function () {
  // 'this' refers to the current document instance

  // The reduce() function calculates the total price for the order
  // by multiplying each item's quantity by its price and summing them up
  // This allows us to get the total dynamically without storing it in totalAmount
  return this.orderItems.reduce(
    (acc, item) => acc + item.productQuantity * item.price,
    0
  );
});
