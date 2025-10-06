const User = require("../models/User");
const { sendError } = require("../utils/response");

const authenticateAdmin = async (req, res, next) => {
  try {
    // Check if req.user exists and has an id
    // This comes from the authenticateUser middleware, which verifies JWT/refresh token
    if (!req.user || !req.user.id) {
      return sendError(res, 401, "User not authenticated");
    }

    const requiredUser = await User.findById(req.user.id);

    if (!requiredUser) {
      return sendError(res, 404, "User not found");
    }

    if (requiredUser.role !== "admin") {
      return sendError(res, 403, "Admin acess required");
    }
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Internal Server Error");
  }
};

module.exports = { authenticateAdmin };
