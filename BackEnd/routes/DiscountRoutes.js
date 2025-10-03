const express = require("express");
const router = express.Router();
const {
  createDiscount,
  updateDiscount,
} = require("../controllers/DiscountController");
const authenticateUser = require("../middleware/auth");

router.post("/", authenticateUser, createDiscount);
router.put("/:id", authenticateUser, updateDiscount);

module.exports = router;
