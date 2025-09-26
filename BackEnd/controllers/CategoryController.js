const { mongoose } = require("mongoose");
const Category = require("../models/Category");

const createCategory = async (req, res) => {
  try {
    const { categoryName, description } = req.body;
    if (!categoryName || !description) {
      return res
        .status(400)
        .json({ status: false, message: "Category name is required." });
    }

    const existingCategory = await Category.findOne({
      categoryName,
    });

    if (existingCategory) {
      return res.status(409).json({
        status: false,
        message: `Category ${categoryName} already exist`,
      });
    }
    const newCategory = new Category({
      categoryName,
      description,
    });

    await newCategory.save();

    return res.status(201).json({
      status: true,
      message: "Category Created Succesfully",
      category: newCategory,
    });
  } catch (error) {
    console.log("Error creating category:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

const getCategories = async (req, res) => {
  try {
    const allCategories = await Category.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Categories Fetched Successfully",
      Categories: allCategories,
    });
  } catch (error) {
    console.log("Error Fetching Categories:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

const getASingleCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Catgory Id not provided" });
    }

    const singleCatgory = await Category.findById(id);

    if (!singleCatgory) {
      return res
        .status(404)
        .json({ status: false, message: "Required  Category does not exist" });
    }
    return res.status(200).json({
      status: true,
      message: "Categorie Fetched successfully",
      category: singleCatgory,
    });
  } catch (error) {
    console.log("Error Fetching Category", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

module.exports = { getASingleCategory, getCategories, createCategory };
