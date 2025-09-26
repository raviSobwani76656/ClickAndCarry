const express = require("express");
const { cancelOrder, createOrder } = require("../controllers/OrderController");
const authenticateUser = require("../middleware/auth");

const router = express.Router();

router.post("/", authenticateUser, createOrder);
router.delete("/:id", authenticateUser, cancelOrder);

module.exports = router;
