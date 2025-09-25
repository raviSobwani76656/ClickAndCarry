const { addReview } = require("../controllers/ReviewController");
const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/auth");

router.post("/addReview", authenticateUser, addReview);

module.exports = router;
