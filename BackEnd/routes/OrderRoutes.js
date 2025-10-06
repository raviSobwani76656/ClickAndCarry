const express = require("express");
const authenticateUser = require("../middleware/auth");
const { adminProtect } = require("../middleware/admin");
const {
  cancelOrder,
  createOrder,
  getAllOrders,
  getSingleOrder,
} = require("../controllers/OrderController");

const router = express.Router();

//Admin Routes
router.get("/", authenticateUser, adminProtect, getAllOrders);

//User Routes
router.post("/", adminProtect, createOrder);
router.delete("/:id", adminProtect, cancelOrder);
router.get("/:id", adminProtect, getSingleOrder);

module.exports = router;
