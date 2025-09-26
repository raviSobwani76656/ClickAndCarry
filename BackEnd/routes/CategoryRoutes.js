const express = require("express");

const {
  getASingleCategory,
  getCategories,
  createCategory,
} = require("../controllers/CategoryController");
const authenticateUser = require("../middleware/auth");
const router = express.Router();

router.get("/getASingleCategory", authenticateUser, getASingleCategory);
router.get("/getCategories", authenticateUser, getCategories);
router.post("/createCategory", authenticateUser, createCategory);

module.exports = router;
0;
