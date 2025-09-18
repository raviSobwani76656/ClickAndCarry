const express = require("express");

const {
  getASingleCategory,
  getCategories,
  createCategory,
} = require("../controllers/CategoryController");
const router = express.Router();

router.get("getASingleCategory", getASingleCategory);
router.get("getCategories", getCategories);
router.post("createCategory", createCategory);

module.exports = router;
