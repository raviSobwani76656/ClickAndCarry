const express = require("express");
const router = express.Router();

const {
  addItems,
  emptyCart,
  updateCart,
} = require("../controllers/CartController");

router.post("addItems", addItems);
router.delete("emptyCart", emptyCart);
router.put("updateCart", updateCart);

module.exports = router;
