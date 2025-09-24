const jwt = require("jsonwebtoken");
require("dotenv").config();

const accessTokenGenerator = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const refreshTokenGenerator = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {
    expiresIn: process.env.JWT_REFRESH_SECRET_EXPIRE,
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    return null;
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY);
  } catch (error) {
    return null;
  }
};

module.exports = {
  verifyRefreshToken,
  verifyToken,
  accessTokenGenerator,
  refreshTokenGenerator,
};
