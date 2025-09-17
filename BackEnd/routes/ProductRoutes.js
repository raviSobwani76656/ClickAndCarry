const express = require("express");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
} = require("../controllers/ProductControllers");

const router = express.Router();

router.post("createProduct", createProduct);
router.put("updateProduct", updateProduct);
router.delete("deleteProduct", deleteProduct);
router.get("getAllProducts", getAllProducts);
router.get("getSingleProducts", getSingleProduct);

module.exports = router;
