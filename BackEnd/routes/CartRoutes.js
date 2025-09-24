const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/auth");

const {
  addItems,
  emptyCart,
  updateCart,
} = require("../controllers/CartController");

router.post("/addItems", authenticateUser, addItems);
router.delete("/emptyCart", authenticateUser, emptyCart);
router.put("/updateCart", authenticateUser, updateCart);

module.exports = router;
