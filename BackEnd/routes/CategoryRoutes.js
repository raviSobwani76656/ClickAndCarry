const express = require("express");
const authenticateUser = require("../middleware/auth");
const { adminProtect } = require("../middleware/admin");
const router = express.Router();
const {
  getASingleCategory,
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/CategoryController");

//Admin Routes
router.post("/", authenticateUser, adminProtect, createCategory);
router.delete("/:id", authenticateUser, adminProtect, deleteCategory);
router.put("/:id", authenticateUser, adminProtect, updateCategory);

//User Routes
router.get("/:id", authenticateUser, getASingleCategory);
router.get("/", authenticateUser, getCategories);

module.exports = router;
