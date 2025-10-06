const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/auth");
const { adminProtect } = require("../middleware/admin");
const {
  createDiscount,
  updateDiscount,
  deleteDiscount,
  getAllDiscounts,
  getSingleDiscount,
} = require("../controllers/DiscountController");

//Admin Routes
router.post("/", authenticateUser, adminProtect, createDiscount);
router.put("/:id", authenticateUser, adminProtect, updateDiscount);
router.delete("/:id", authenticateUser, adminProtect, deleteDiscount);

//User Routes
router.get("/", authenticateUser, getAllDiscounts);
router.get("/:id", authenticateUser, getSingleDiscount);

module.exports = router;
