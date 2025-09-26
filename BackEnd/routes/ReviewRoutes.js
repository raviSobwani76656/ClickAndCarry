const { addReview, deleteReview } = require("../controllers/ReviewController");
const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/auth");

router.post("/addReview", authenticateUser, addReview);
router.delete("/deleteReview/:productId", authenticateUser, deleteReview);

module.exports = router;
