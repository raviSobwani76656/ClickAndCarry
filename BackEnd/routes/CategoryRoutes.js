const express = require("express");

const {
  getASingleCategory,
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/CategoryController");
const authenticateUser = require("../middleware/auth");
const router = express.Router();

router.get("/:id", authenticateUser, getASingleCategory);
router.get("/", authenticateUser, getCategories);
router.post("/", authenticateUser, createCategory);
router.delete("/:id", authenticateUser, deleteCategory);
router.put("/:id", authenticateUser, updateCategory);

module.exports = router;
