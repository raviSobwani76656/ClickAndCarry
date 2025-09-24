const Review = require("../models/Review");

const addReview = async (req, res) => {
  try {
    const { productId, ratings, comment } = req.body;

    const userId = req.user._id;

    if (!productId || !userId || !comment) {
      return res
        .status(400)
        .json({ status: false, message: "Enter Valid Information" });
    }

    const addedReview = new Review({
      productId,
      userId,
      ratings,
      comment,
      helpfulVotes,
      verifiedPurchase,
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
