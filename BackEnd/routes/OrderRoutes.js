const express = require("express");
const { cancelOrder, createOrder } = require("../controllers/OrderController");
const authenticateUser = require("../middleware/auth");

const router = express.Router();

router.post("createOrder", authenticateUser, createOrder);
router.delete("cancelOrder", authenticateUser, cancelOrder);

module.exports = router;
