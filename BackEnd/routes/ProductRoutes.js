const express = require("express");

const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
} = require("../controllers/ProductControllers");
const authenticateUser = require("../middleware/auth");
const { adminProtect } = require("../middleware/admin");

const router = express.Router();

//Admin Routes
router.post("/", authenticateUser, adminProtect, createProduct);
router.put("/:id", authenticateUser, adminProtect, updateProduct);
router.delete("/:id", authenticateUser, adminProtect, deleteProduct);

//User Routes
router.get("/", authenticateUser, getAllProducts);
router.get("/:id", authenticateUser, getSingleProduct);

module.exports = router;
