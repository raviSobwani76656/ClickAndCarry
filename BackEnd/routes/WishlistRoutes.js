const express = require("express");
const {
  addToWishlist,
  addItems,
  getWishlist,
  removeItems,
} = require("../controllers/WishlistController");
const authenticateUser = require("../middleware/auth");
const router = express.Router();

router.post("/", authenticateUser, addToWishlist);
router.post("/:id/add-items", authenticateUser, addItems);
router.get("/:id", authenticateUser, getWishlist);
router.post("/:id/remove-items", authenticateUser, removeItems);

module.exports = router;
