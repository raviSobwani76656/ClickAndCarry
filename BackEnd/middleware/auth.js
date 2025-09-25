const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");
const { accessTokenGenerator } = require("../utils/jwtTokenGenerator");

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token = authHeader && authHeader.split(" ")[1];

    console.log(token);

    if (!token) {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        return res
          .status(401)
          .json({ status: false, message: "Not Authenticated" });
      }

      const tokenHash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

      const now = new Date();
      const user = await User.findOne({
        "refreshTokens.tokenHash": tokenHash,
        "refreshTokens.expiresAt": { $gt: now },
      });

      if (!user)
        return res
          .status(403)
          .json({ status: false, message: "Invalid or expired refresh token" });

      // Generate new access token
      token = accessTokenGenerator({ id: user._id, email: user.email });
      res.setHeader("x-access-token", token);

      req.user = { id: user._id };
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    console.error(error);
    res
      .status(403)
      .json({ status: false, message: "Token invalid or expired" });
  }
};

module.exports = authenticateUser;
