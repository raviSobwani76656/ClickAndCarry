const User = require("../models/User");
const {
  accessTokenGenerator,
  refreshTokenGenerator,
} = require("../utils/jwtTokenGenerator");
const crypto = require("crypto");

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
    console.log("req.body", req.body);

    console.log("HEaders", req.headers["content-type"]);
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

    const accessTokenValue = accessTokenGenerator({
      id: requiredUser._id,
      email: requiredUser.email,
    });

    const refreshTokenValue = refreshTokenGenerator({
      id: requiredUser._id,
      email: requiredUser.email,
    });

    const tokenHash = crypto
      .createHash("sha256")
      .update(refreshTokenValue)
      .digest("hex");

    requiredUser.refreshTokens.push({
      tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await requiredUser.save();

    res.cookie("refreshToken", refreshTokenValue, {
      httpOnly: true, // The cookie cannot be accessed by JavaScript on the client side (helps prevent XSS attacks)
      secure: process.env.NODE_ENV === "production", // Cookie is sent only over HTTPS when in production
      samesite: "Strict", // Cookie is only sent in requests originating from the same site (prevents CSRF attacks)
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time in milliseconds (7 days). Note: should likely be 7 * 24 * 60 * 60 * 1000 for exact 7 days
    });

    res.status(200).json({
      status: true,
      message: "Login SuccessFull",
      accessTokenValue,
      user: requiredUser,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

const logout = async function (req, res) {
  try {
    res.clearCookie("refreshToken");
    res.status(200).json({ status: true, message: "Logout SuccessFull" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

module.exports = { createAccount, login, logout };
