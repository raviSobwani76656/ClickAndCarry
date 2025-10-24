const express = require("express");
const {
  createPayment,
  getPaymentIntent,
  paymentRefund,
} = require("../controllers/PaymentController");
const router = express.Router();

router.post("/", authenticateUser, createPayment);
router.get("/:paymentIntentID", authenticateUser, getPaymentIntent);
router.post("/refund", authenticateUser, paymentRefund);

router.post("/test", (req, res) => {
  res.json({ message: "Refund route works!" });
});

module.exports = router;
