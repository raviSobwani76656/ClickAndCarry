const express = require("express");
const router = express();
const { createDiscount } = require("../controllers/DiscountController");

router.post("/", createDiscount);

module.exports = { router };
