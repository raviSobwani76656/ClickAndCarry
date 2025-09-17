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

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ status: false, message: "Please enter Valid Credentials" });
    }

    const requiredUser = await User.findOne({ email });

    if (!requiredUser) {
      return res
        .status(404)
        .json({ status: false, message: "Email Address Not Registered" });
    }

    const isMatch = await requiredUser.comparePasswords(password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ status: false, message: "Password Not Correct" });
    }

    res.status(200).json({ status: true, message: "Login SuccessFull" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

const logout = async function (req, res) {
  try {
    res.status(200).json({ status: true, message: "Logout SuccessFull" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

module.exports = { createAccount, login, logout };
