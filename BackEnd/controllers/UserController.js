const User = require("../models/User");

const createAccount = async function (req, res) {
  try {
    const { name, email, password, gender } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ status: false, message: "User with this email already exist" });
    }

    const newUser = new User({
      name,
      email,
      password,
      gender,
    });

    await newUser.save();

    if (newUser) {
      return res.status(200).json({
        status: true,
        message: "User Account Created SuccessFully",
      });
    }
  } catch (error) {
    console.log("Error Occured while creating the Uer", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

module.exports = { createAccount };
