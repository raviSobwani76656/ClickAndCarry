const Discount = require("../models/Discount");
const mongoose = require("mongoose");
const { sendError, sendSuccess } = require("../utils/response");

const createDiscount = async (req, res) => {
  try {
    const {
      code,
      description,
      ProductCategory,
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
      !ProductCategory ||
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

    const validFromDate = new Date(validFrom);
    const validTillDate = new Date(validTill);

    if (isNaN(validFromDate.getTime())) {
      return sendError(res, 400, "Invalid valid from date");
    }

    if (isNaN(validTillDate.getTime())) {
      return sendError(res, 400, "Invalid valid till date");
    }

    const newDiscount = new Discount({
      code,
      description,
      ProductCategory,
      discountType,
      perUserLimit,
      minPurchaseAmount,
      maxPurchaseAmount,
      validFrom: validFromDate,
      isActive,
      validTill: validTillDate,
    });

    await newDiscount.save();

    return sendSuccess(res, 201, "New discount created");
  } catch (error) {
    console.error(error.stack);
    return sendError(res, 500, "Internal Server Error");
  }
};

module.exports = { createDiscount };
