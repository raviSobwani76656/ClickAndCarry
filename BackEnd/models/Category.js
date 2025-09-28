const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: [2, "Category should have atleast 2 characters"],
      maxLength: [50, "Category can have max length of 50 characters"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
      maxLength: [500, "Description Cannot exceed 500 character"],
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

categorySchema.pre("validate", async function (next) {
  try {
    if (this.isModified("categoryName")) {
      this.slug = this.categoryName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }
    next();
  } catch (error) {
    console.error(error);
  }
});
module.exports = mongoose.model("Category", categorySchema);
