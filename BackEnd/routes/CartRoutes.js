const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/auth");

const {
  addItems,
  emptyCart,
  updateCart,
} = require("../controllers/CartController");

router.post("/", authenticateUser, addItems);
router.delete("/", authenticateUser, emptyCart);
router.put("/", authenticateUser, updateCart);

module.exports = router;
