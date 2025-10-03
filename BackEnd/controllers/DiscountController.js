const Discount = require("../models/Discount");
const mongoose = require("mongoose");
const { sendError, sendSuccess } = require("../utils/response");
const Category = require("../models/Category");
const Product = require("../models/Product");

const createDiscount = async (req, res) => {
  try {
    const {
      code,
      description,
      productCategory,
      discountType,
      product,
      perUserLimit,
      minPurchaseAmount,
      maxPurchaseAmount,
      validFrom,
      isActive,
      validTill,
    } = req.body;

    // Validate inputs
    if (
      !code ||
      !description ||
      !productCategory ||
      !product ||
      !discountType ||
      typeof perUserLimit !== "number" ||
      typeof minPurchaseAmount !== "number" ||
      typeof maxPurchaseAmount !== "number" ||
      typeof isActive !== "boolean" ||
      !validFrom ||
      !validTill
    ) {
      return sendError(res, 400, "Invalid Data");
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(productCategory)) {
      return sendError(res, 400, "Invalid Category ID");
    }

    console.log("Product Category ID from body:", productCategory);
    console.log(
      "Is valid ObjectId?",
      mongoose.Types.ObjectId.isValid(productCategory)
    );

    const categoryExists = await Category.findById(productCategory);
    if (!categoryExists) return sendError(res, 404, "Category not found");

    const productExists = await Product.findById(product);
    if (!productExists) return sendError(res, 404, "Products not Exists");

    const discount = new Discount({
      code,
      description,
      productCategory,
      discountType,
      perUserLimit,
      minPurchaseAmount,
      maxPurchaseAmount,
      validFrom: new Date(validFrom),
      validTill: new Date(validTill),
      isActive,
    });

    await discount.save();

    return sendSuccess(res, 201, "Discount created successfully", discount);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Internal server error");
  }
};

const updateDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      code,
      description,
      productCategory,
      product,
      discountType,
      perUserLimit,
      minPurchaseAmount,
      maxPurchaseAmount,
      validFrom,
      isActive,
      validTill,
    } = req.body;

    if (
      !code ||
      !description ||
      !productCategory ||
      !discountType ||
      !product ||
      typeof perUserLimit !== "number" ||
      typeof minPurchaseAmount !== "number" ||
      typeof maxPurchaseAmount !== "number" ||
      typeof isActive !== "boolean" ||
      !validFrom ||
      !validTill
    ) {
      return sendError(res, 400, "Invalid Data");
    }

    const validFromDate = new Date(validFrom);
    const validTillDate = new Date(validTill);

    const categoryExists = await Category.findById(productCategory);
    if (!categoryExists) return sendError(res, 404, "Category not found");

    const productExists = await Product.findById(product);
    if (!productExists) return sendError(res, 404, "Product not found");

    if (isNaN(validFromDate.getTime())) {
      return sendError(res, 400, "Invalid valid from Date");
    }

    if (isNaN(validTillDate.getTime())) {
      return sendError(res, 400, "Invalid valid till Date");
    }
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, "Invalid mongoose Id");
    }

    const discountToUpdate = await Discount.findOneAndUpdate(
      { _id: id },

      {
        $set: {
          code: code,
          description: description,
          productCategory: productCategory,
          product: product,
          discountType: discountType,
          perUserLimit: perUserLimit,
          minPurchaseAmount: minPurchaseAmount,
          maxPurchaseAmount: maxPurchaseAmount,
          validFrom: validFromDate,
          isActive: isActive,
          validTill: validTillDate,
        },
      },
      { runValidators: true, new: true }
    );

    if (!discountToUpdate) {
      return sendError(res, 404, "Discount not found");
    }

    return sendSuccess(
      res,
      200,
      "Discount updated successfully",
      discountToUpdate
    );
  } catch (error) {
    console.log(error.stack);
    return sendError(res, 500, "Internal server error");
  }
};

const deleteDiscount = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, "Invalid discount id");
    }

    const discount = await Discount.findByIdAndDelete(id);

    if (!discount) {
      return sendError(res, 404, "Discount not found");
    }
    return sendSuccess(res, 200, "Discount deleted Succcessfully");
  } catch (error) {
    console.log(error.stack);
    return sendError(res, 500, "Internal server error");
  }
};

const getAllDiscounts = async (req, res) => {
  try {
    const allDiscounts = await Discount.find()
      .populate("product")
      .populate("productCategory", "categoryName")
      .sort({ createdAt: -1 });

    return sendSuccess(
      res,
      200,
      "Discounts fetched successfully",
      allDiscounts
    );
  } catch (error) {
    console.error(error.stack);
    return sendError(res, 500, "Internal server error");
  }
};

module.exports = {
  createDiscount,
  updateDiscount,
  deleteDiscount,
  getAllDiscounts,
};
