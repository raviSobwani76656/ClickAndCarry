const express = require("express");
const { addToWishlist } = require("../controllers/WishlistController");
const authenticateUser = require("../middleware/auth");
const router = express.Router();

router.post("/", authenticateUser, addToWishlist);

module.exports = router;
