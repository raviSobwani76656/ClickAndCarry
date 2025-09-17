const Product = require("../models/Product");

const createProduct = async (req, res) => {
  try {
    const { name, category, price, description, stock, images } = req.body;

    if (!name || !category || !price || !description || !stock) {
      return res
        .status(400)
        .json({ message: "Enter all the required Details" });
    }

    const newProduct = new Product({
      name,
      category,
      price,
      description,
      stock,
    });

    await newProduct.save();
    return res.status(201).json({
      status: true,
      message: "Product Created and listed successfully",
      product: newProduct,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, category, price, description, stock } = req.body;

    const productToUpdate = await Product.findById(id);

    if (!productToUpdate) {
      return res.status(404).json({
        status: false,
        message: "The product you are looking for does not exist",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: { name, category, price, description, stock, images } },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: true,
      message: "Product Updated SuccessFully",
      product: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const ProductTodelete = await Product.findById(id);

    if (!ProductTodelete) {
      return res
        .status(404)
        .json({ message: "The product you are looking for does not exist" });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    res
      .status(200)
      .json({ status: true, message: "Product Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const productToGet = await Product.findById(id);

    if (!productToGet) {
      return res
        .status(404)
        .json({ message: "The product you are looking for does not exist" });
    }

    res.status(200).json({
      status: true,
      message: "Product Retrived Successfully",
      product: productToGet,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Products Retrived Successfully",
      products: allProducts,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
};
