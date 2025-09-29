const mongoose = require("mongoose");
const Review = require("../models/Review");
const { sendError, sendSuccess } = require("../utils/response");

const addReview = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.params:", req.params);
    console.log("req.user:", req.user);
    const { ratings, comment, helpfulVotes, verifiedPurchase } = req.body;
    const userId = req.user.id;
    const productId = req.params.productId;

    console.log(userId);
    console.log(productId);

    if (
      !mongoose.Types.ObjectId.isValid(productId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return sendError(res, 400, "Enter Valid Product Id and User Id");
    }

    if (!comment || comment.length < 3 || comment.length > 500) {
      return sendError(res, 400, "Enter Valid Comment");
    }

    if (ratings && (ratings < 1 || ratings > 5)) {
      return sendSuccess(res, 400, "Invalid ratings");
    }

    const existingReview = await Review.findOne({ userId, productId });

    if (existingReview) {
      return sendError(res, 400, "User has already reviewed this product");
    }

    const newReview = new Review({
      productId,
      userId,
      ratings: ratings || 1,
      comment,
      helpfulVotes: helpfulVotes || 0,
      verifiedPurchase: verifiedPurchase || false,
    });

    await newReview.save();

    return sendSuccess(res, 201, "Review added successfully", newReview);
  } catch (error) {
    console.error(error.stack);
    return sendError(res, 500, "Internal server error");
  }
};

const deleteReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    if (!userId || !productId) {
      return sendError(res, 400, "Please provide valid user and product IDs");
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return sendError(res, 400, "Invalid product ID");
    }

    const review = await Review.findOne({ userId, productId });
    if (!review) {
      return sendError(res, 404, "Review does not exist");
    }

    await Review.deleteOne({ userId, productId });

    return sendSuccess(res, 200, "Review deleted successfully");
  } catch (error) {
    console.error(error.stack);
    return sendError(res, 500, "Internal server error");
  }
};

module.exports = {
  addReview,
  deleteReview,
};
