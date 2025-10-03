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
        usedCount: { type: Number, default: 0 },
      },
    ],
    description: {
      type: String,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    productCategory: {
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
      default: 0,
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

// Pre-save hook: calculate discountValue
DiscountSchema.pre("save", async function (next) {
  try {
    await this.populate("productCategory");
    const categoryName = this.productCategory.categoryName.toLowerCase();

    switch (categoryName) {
      case "utensils":
        this.discountValue = 45;
        break;
      case "shoes":
        this.discountValue = 22;
        break;
      case "shirts":
        this.discountValue = 15;
        break;
      case "pants":
        this.discountValue = 35;
        break;
      default:
        this.discountValue = 10;
    }

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Discount", DiscountSchema);
