const User = require("../models/User");
const {
  accessTokenGenerator,
  refreshTokenGenerator,
} = require("../utils/jwtTokenGenerator");
const crypto = require("crypto");
const { sendError, sendSuccess } = require("../utils/response");

const createAccount = async function (req, res) {
  try {
    const { name, email, password, gender } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return sendError(res, 400, "User with same email Already exists");
    }

    const newUser = new User({
      name,
      email,
      password,
      gender,
    });

    await newUser.save();

    if (newUser) {
      return sendSuccess(res, 201, "New user created Successfully");
    }
  } catch (error) {
    console.error(error.stack);
    return sendError(res, 500, "Interval Server Error");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, "Enter All required Details");
    }

    const requiredUser = await User.findOne({ email });

    if (!requiredUser) {
      return sendError(res, 404, "Invalid credentials");
    }

    const isMatch = await requiredUser.comparePasswords(password);

    if (!isMatch) {
      return sendError(res, 400, "Invalid Credentials");
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
      sameSite: "Strict", // Cookie is only sent in requests originating from the same site (prevents CSRF attacks)
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time in milliseconds (7 days). Note: should likely be 7 * 24 * 60 * 60 * 1000 for exact 7 days
    });

    const { _id, name, gender } = requiredUser;

    return sendSuccess(res, 200, "Login successfull", accessTokenValue, {
      user: { _id, name, email, gender },
    });
  } catch (error) {
    console.error(error.stack);
    return sendError(res, 500, "Internal Server Error");
  }
};

const logout = async function (req, res) {
  try {
    // Retrieve the refresh token from the cookies sent by the client
    const refreshToken = req.cookies.refreshToken;

    // Check if a refresh token exists
    if (refreshToken) {
      // Hash the refresh token using SHA-256 algorithm for security
      // This ensures that even if someone gets the database, they won't see the plain token
      const tokenHash = crypto
        .createHash("sha256") // create a SHA-256 hash object
        .update(refreshToken) // input the refresh token into the hash
        .digest("hex"); // get the hashed value as a hexadecimal string

      // Remove the hashed refresh token from the user's record in the database
      // This effectively "logs out" the user by invalidating that refresh token
      await User.updateOne(
        { _id: req.user.id }, // find the user by their ID (from the auth middleware)
        { $pull: { refreshTokens: { tokenHash } } } // pull/remove the tokenHash from the refreshTokens array
      );
    }

    // Clear the refresh token cookie from the client browser
    // This ensures the client no longer sends the old refresh token with requests
    res.clearCookie("refreshToken");
    return sendSuccess(res, 200, "Logout SuccessFull");
  } catch (error) {
    console.error(error.stack);
    return sendError(res, 500, "Interval Server Error");
  }
};

const refreshToken = async (req, res) => {
  try {
    const token =
      req.cookies.refreshToken ||
      req.body.refreshToken ||
      req.headers["x-refresh-token"];

    if (!token) {
      return sendError(res, 400, "Enter Valid refreshToken");
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      "refreshTokens.tokenHash": tokenHash,
    });

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    const accessToken = accessTokenGenerator({
      id: user._id,
      email: user.email,
    });

    return sendSuccess(
      res,
      200,
      "Access token generated succesfully",
      accessToken
    );
  } catch (error) {
    console.error(error.stack);
    return sendError(res, 500, "Internal Server Error");
  }
};

module.exports = { createAccount, login, logout, refreshToken };
