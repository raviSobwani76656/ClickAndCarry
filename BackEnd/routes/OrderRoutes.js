const express = require("express");
const { cancelOrder, createOrder } = require("../controllers/OrderController");

const router = express.Router();

router.post("createOrder", createOrder);
router.delete("cancelOrder", cancelOrder);

module.exports = router;
