const express = require("express");
const {
  addToWishlist,
  addItems,
} = require("../controllers/WishlistController");
const authenticateUser = require("../middleware/auth");
const router = express.Router();

router.post("/", authenticateUser, addToWishlist);
router.post("/:id", authenticateUser, addItems);

module.exports = router;
