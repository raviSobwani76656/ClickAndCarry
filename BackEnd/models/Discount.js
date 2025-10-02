const mongoose = require("mongoose");

const DiscountSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },

    user: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        usedCount: {
          type: Number,
          default: 0,
        },
      },
    ],
    description: {
      type: String,
    },

    ProductCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    perUserLimit: {
      type: Number,
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },
    minPurchaseAmount: {
      type: Number,
      min: 0,
    },
    maxPurchaseAmount: {
      type: Number,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validTill: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

// ✅ Pre-save hook with populated category
DiscountSchema.pre("save", async function (next) {
  try {
    // populate the ProductCategory field
    await this.populate("ProductCategory");

    const categoryName = this.ProductCategory.name; // assuming Category schema has a "name" field

    if (categoryName === "Utensils") {
      this.discountValue = 45;
    } else if (categoryName === "Shoes") {
      this.discountValue = 22;
    } else if (categoryName === "Shirts") {
      this.discountValue = 15;
    } else if (categoryName === "Pants") {
      this.discountValue = 35;
    } else {
      this.discountValue = 10;
    }

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Discount", DiscountSchema);
