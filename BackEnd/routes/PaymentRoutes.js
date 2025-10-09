const express = require("express");
const { createPayment } = require("../controllers/PaymentController");
const router = express.Router();

router.post("/", createPayment);

module.exports = router;
