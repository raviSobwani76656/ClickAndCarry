const express = require("express");
const router = express.Router();
const { createDiscount } = require("../controllers/DiscountController");

router.post("/", createDiscount);

module.exports = router;
