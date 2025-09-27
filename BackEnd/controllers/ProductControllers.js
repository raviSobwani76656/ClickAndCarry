const { default: mongoose } = require("mongoose");
const Category = require("../models/Category");
const Product = require("../models/Product");
const { sendError, sendSuccess } = require("../utils/response");

const createProduct = async (req, res) => {
  try {
    const { name, category, price, description, stock, images } = req.body;

    if (!name || !category || !price || !description || !stock) {
      return sendError(res, 400, "Enter all the required Details");
    }

    const categoryDoc = await Category.findOne({ categoryName: category });

    if (!categoryDoc) {
      return sendError(res, 400, "Category Not Found");
    }

    const newProduct = new Product({
      name: name.trim(),
      category: categoryDoc._id,
      price: Number(price),
      description: description.trim(),
      stock: Number(stock),
    });

    await newProduct.save();
    await newProduct.populate("category", "categoryName");

    return sendSuccess(res, 201, "Product Created and listed SuccessFully", {
      product: newProduct,
    });
  } catch (error) {
    console.error(error.stack);
    return sendError(res, 500, "Internal Server Error");
  }
};

// Update an existing product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, "Invalid Product Id");
    }

    const { name, category, price, description, stock, images } = req.body;

    if (!name && !category && !price && !description && !stock && !images) {
      return sendError(res, 400, "No fields to update");
    }

    const productToUpdate = await Product.findById(id);

    if (!productToUpdate) {
      return sendError(res, 404, "Product not found with the given ID");
    }

    // Default to the current category of the product
    let categoryId = productToUpdate.category;

    // Check if a new category name was provided in the request body
    if (category) {
      // Find the category document in the database by its name
      const categoryDoc = await Category.findOne({ categoryName: category });

      // If the category doesn't exist, return an error response
      if (!categoryDoc) {
        return sendError(res, 400, "Invalid Category Id");
      }

      // If category exists, update categoryId to the ObjectId of the new category
      categoryId = categoryDoc._id;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        // $set updates only the specified fields without overwriting the whole document
        $set: { name, category: categoryId, price, description, stock, images },
      },
      {
        new: true, // Returns the updated document instead of the old one
        runValidators: true, // Ensures schema validations are applied
      }
    ).populate("category", "categoryName");

    return sendSuccess(res, 200, "Product updated successfully", {
      produc: updatedProduct,
    });
  } catch (error) {
    console.error(error.stack);
    return sendError(res, 500, "Internal Server Error");
  }
};
// Delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, "Invalid product ID format");
    }

    const productTodelete = await Product.findById(id);

    if (!productTodelete) {
      return sendError(res, 404, "Product not found with the given ID");
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    return sendSuccess(res, 200, "Product deleted Successfully");
  } catch (error) {
    console.error(error.stack);
    return sendError(res, 500, "Internal Server Error");
  }
};

// Get a single product by ID
const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, "Enter Valid Id");
    }

    const productToGet = await Product.findById(id).populate(
      "category",
      "categoryName"
    );

    if (!productToGet) {
      return sendError(res, 404, "Product not found with the given ID");
    }

    return sendSuccess(res, 200, "Product retrieved successfully", {
      product: productToGet,
    });
  } catch (error) {
    console.error(error.stack);
    return sendError(res, 500, " Internal Server Error");
  }
};
// Get all products
const getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find()
      .populate("category", "categoryName")
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, "Products retrieved succesfully", {
      products: allProducts,
    });
  } catch (error) {
    console.log(error);
    return sendError(res, 500, "Internal Server Error");
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
};
