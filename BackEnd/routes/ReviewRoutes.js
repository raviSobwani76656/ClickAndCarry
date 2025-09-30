const { addReview, deleteReview } = require("../controllers/ReviewController");
const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/auth");

router.post("/:productId", authenticateUser, addReview);
router.delete("/:productId", authenticateUser, deleteReview);

module.exports = router;
