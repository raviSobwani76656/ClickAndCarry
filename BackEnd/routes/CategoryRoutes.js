const express = require("express");

const {
  getASingleCategory,
  getCategories,
  createCategory,
} = require("../controllers/CategoryController");
const authenticateUser = require("../middleware/auth");
const router = express.Router();

router.get("/:id", authenticateUser, getASingleCategory);
router.get("/", authenticateUser, getCategories);
router.post("/", authenticateUser, createCategory);

module.exports = router;
