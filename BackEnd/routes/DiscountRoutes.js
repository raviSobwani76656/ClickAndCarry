const express = require("express");
const router = express.Router();
const {
  createDiscount,
  updateDiscount,
  deleteDiscount,
  getAllDiscounts,
  getSingleDiscount,
} = require("../controllers/DiscountController");
const authenticateUser = require("../middleware/auth");

router.post("/", authenticateUser, createDiscount);
router.put("/:id", authenticateUser, updateDiscount);
router.delete("/:id", authenticateUser, deleteDiscount);
router.get("/", authenticateUser, getAllDiscounts);
router.get("/:id", authenticateUser, getSingleDiscount);

module.exports = router;
