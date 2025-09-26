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

router.post("/", authenticateUser, createProduct);
router.put("/:id", authenticateUser, updateProduct);
router.delete("/:id", authenticateUser, deleteProduct);
router.get("/", authenticateUser, getAllProducts);
router.get("/:id", authenticateUser, getSingleProduct);

module.exports = router;
