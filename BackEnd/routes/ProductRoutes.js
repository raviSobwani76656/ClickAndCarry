const express = require("express");

const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
} = require("../controllers/ProductControllers");
const authenticateUser = require("../middleware/auth");

const router = express.Router();

router.post("createProduct", authenticateUser, createProduct);
router.put("updateProduct", authenticateUser, updateProduct);
router.delete("deleteProduct", authenticateUser, deleteProduct);
router.get("getAllProducts", authenticateUser, getAllProducts);
router.get("getSingleProducts", authenticateUser, getSingleProduct);

module.exports = router;
