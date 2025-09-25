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

    if (!userId) {
      return res
        .status(400)
        .json({ status: false, message: "Please enter User Id" });
    }

    const reviewTodelete = await Review.findOne({ userId });

    if (!reviewTodelete) {
      return res.status(400).json({ message: "The Review Does not Exist" });
    }

    await Review.deleteOne({ userId });
    return res
      .status(200)
      .json({ status: true, message: "Review Deleted Successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

module.exports = {
  addReview,
  deleteReview,
};
