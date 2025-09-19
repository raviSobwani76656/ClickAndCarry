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
      userCard.totalAmount = totalAmount;
      await userCard.save();
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

const updateCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const { cartItems, totalAmount } = req.body;

    if (!userId || !cartItems || !totalAmount) {
      return res
        .status(400)
        .json({ status: false, message: "Enter Valid Details" });
    }

    const requiredCart = await Cart.findOne({ userId });

    if (!requiredCart) {
      return res
        .status(400)
        .json({ status: false, message: "Required Cart Does not Exist" });
    }
    requiredCart.cartItems = cartItems;
    requiredCart.totalAmount = totalAmount;

    await requiredCart.save();

    return res
      .status(200)
      .json({ status: true, message: "Cart Updated SuccessFully" });
  } catch (error) {
    console.log("Error Occured While Updating Cart:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

const emptyCart = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res
        .status(400)
        .json({ status: false, message: "Enter The valid UserId" });
    }

    const userCart = await Cart.findOne({ userId });

    if (!userCart) {
      return res
        .status(404)
        .json({ message: "Required Usercart does not Exist" });
    }

    const cartTodelete = await Cart.deleteOne({ userId });
    return res
      .status(200)
      .json({ status: true, message: "Cart Removed SuccessFully" });
  } catch (error) {
    console.log("Error Occured While deleting Cart:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};
