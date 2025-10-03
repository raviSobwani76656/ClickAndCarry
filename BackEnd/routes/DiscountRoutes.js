const express = require("express");
const router = express.Router();
const {
  createDiscount,
  updateDiscount,
  deleteDiscount,
  getAllDiscounts,
} = require("../controllers/DiscountController");
const authenticateUser = require("../middleware/auth");

router.post("/", authenticateUser, createDiscount);
router.put("/:id", authenticateUser, updateDiscount);
router.delete("/:id", authenticateUser, deleteDiscount);
router.get("/", authenticateUser, getAllDiscounts);

module.exports = router;
