const Cart = require("../models/Cart");

const addItems = async (req, res) => {
  try {
    const { cartItems, totalAmount } = req.body;
    const userId = req.user._id;

    if (!userId || !cartItems || !totalAmount) {
      return res
        .status(400)
        .json({ status: false, message: "Enter valid details" });
    }

    const userCard = await Cart.findOne({ userId });

    if (userCard) {
      userCard.cartItems = cartItems;
      userCard.cartItems = cartItems;
    } else {
      const addedItems = new Cart({
        userId,
        cartItems,
        totalAmount,
      });

      await addedItems.save();
    }

    res
      .status(201)
      .json({ status: true, message: "Cart Created Successfully" });
  } catch (error) {
    console.log("Error Occrured", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};
