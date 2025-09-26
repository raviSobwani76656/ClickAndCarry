const { default: mongoose } = require("mongoose");
const Review = require("../models/Review");

const addReview = async (req, res) => {
  try {
    const { productId, ratings, comment, helpfulVotes, verifiedPurchase } =
      req.body;

    const userId = req.user.id;

    if (!productId || !userId || !comment) {
      return res
        .status(400)
        .json({ status: false, message: "Enter Valid Information" });
    }

    const exisitingReview = await Review.findOne({ userId });

    if (exisitingReview) {
      return res.status(400).json({
        status: false,
        message: "User Already Reviewed the product",
      });
    }

    const addedReview = new Review({
      productId,
      userId,
      ratings,
      comment,
      helpfulVotes: helpfulVotes || 0,
      verifiedPurchase: verifiedPurchase || false,
    });

    await addedReview.save();

    return res
      .status(201)
      .json({ status: true, message: "Review Added SuccessFully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Interval Server Error" });
  }
};

const deleteReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId; // Removed .replace(/"/g, "")

    console.log("Received productId:", productId); // Debug log
    console.log("UserId:", userId);

    // Check for missing inputs first
    if (!userId || !productId) {
      return res.status(400).json({
        status: false,
        message: "Please provide valid user and product IDs",
      });
    }

    // Validate productId as a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid product ID" });
    }

    // Find the review by userId and productId
    const reviewToDelete = await Review.findOne({ userId, productId });
    if (!reviewToDelete) {
      return res
        .status(404)
        .json({ status: false, message: "Review does not exist" });
    }

    // Delete the specific review
    await Review.deleteOne({ userId, productId });

    return res
      .status(200)
      .json({ status: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error in deleteReview:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};
module.exports = {
  addReview,
  deleteReview,
};
