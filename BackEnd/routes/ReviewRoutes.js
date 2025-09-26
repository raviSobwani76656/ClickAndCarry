const { addReview, deleteReview } = require("../controllers/ReviewController");
const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/auth");

router.post("/", authenticateUser, addReview);
router.delete("/:id", authenticateUser, deleteReview);

module.exports = router;
