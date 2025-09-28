const mongoose = require("mongoose"); // Correct import
const Category = require("../models/Category");
const { sendError, sendSuccess } = require("../utils/response");

exports.createCategory = async (req, res) => {
  try {
    const { categoryName, description } = req.body;

    if (!categoryName || !description) {
      return sendError(res, 400, "Category name and description are required.");
    }

    const existingCategory = await Category.findOne({ categoryName });

    if (existingCategory) {
      return sendError(res, 400, "Category already exists");
    }

    const newCategory = new Category({ categoryName, description });
    await newCategory.save();

    return sendSuccess(res, 201, "New category created successfully");
  } catch (error) {
    console.error(error.stack);
    return sendError(res, 500, "Internal Server Error");
  }
};

exports.getCategories = async (req, res) => {
  try {
    const allCategories = await Category.find().sort({ createdAt: -1 });
    return sendSuccess(
      res,
      200,
      "Categories fetched successfully",
      allCategories
    );
  } catch (error) {
    console.error(error.stack);
    return sendError(res, 500, "Internal Server Error");
  }
};

exports.getASingleCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, "Valid Category ID is required");
    }

    const singleCategory = await Category.findById(id);

    if (!singleCategory) {
      return sendError(res, 404, "Category does not exist");
    }

    return sendSuccess(
      res,
      200,
      "Category fetched successfully",
      singleCategory
    );
  } catch (error) {
    console.error(error.stack);
    return sendError(res, 500, "Internal Server Error");
  }
};
