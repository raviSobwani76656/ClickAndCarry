const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto"); // Node.js built-in module for cryptographic operations
const { refreshToken } = require("../utils/jwtTokenGenerator"); // Custom JWT token generator utility
require("dotenv").config(); // Load environment variables from .env file

// Define User schema for MongoDB
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // User's full name
    email: { type: String, required: true, unique: true }, // User's email (must be unique)
    password: { type: String, required: true }, // User's password (hashed before save)

    gender: { type: String, enum: ["Male", "Female", "Other"], required: true }, // User's gender
    age: Number, // Optional user age
    refreshTokens: [{ tokenHash: String, expiresAt: Number, meta: Object }],
  },

  { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

// Pre-save hook to hash password before saving to DB
userSchema.pre("save", async function (next) {
  // Only hash password if it is new or modified
  if (!this.isModified("password")) return next();

  try {
    const saltRounds = process.env.BCRYPT_ROUND; // Number of salt rounds from env
    this.password = await bcrypt.hash(this.password, saltRounds); // Hash password
    next(); // Continue saving the user
  } catch (error) {
    next(error); // Pass error to mongoose if hashing fails
  }
});

// Method to compare a plain password with the hashed password in DB
userSchema.methods.comparePasswords = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password); // Returns true if match
};

// Method to add a new refresh token to user's document
userSchema.methods.addRefreshToken = async function (refreshToken, meta) {
  // Create a secure hash of the refresh token using SHA-256
  // Ensures the token is not stored in plain text in the database
  const tokenHash = crypto
    .createHash("sha256") // Create a SHA-256 hash instance
    .update(refreshToken) // Input the refresh token string
    .digest("hex"); // Output the hash as hexadecimal string

  // Calculate expiration time for the refresh token
  // parseDuration converts strings like "30d" or "12h" into milliseconds
  const expiresAt =
    Date.now() + parseDuration(process.env.JWT_REFRESH_SECRET_EXPIRE);

  // Add hashed token, expiration timestamp, and meta info to user's refreshTokens array
  // 'meta' can include device type, IP address, browser, etc.
  this.refreshTokens.push({ tokenHash, expiresAt, meta });

  // Save updated user document to the database
  // 'await' ensures saving completes before moving on
  await this.save();
};

// Method to check if a refresh token exists and is valid
userSchema.methods.hasRefreshToken = async function (refreshToken) {
  // Hash the provided refresh token
  const tokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  // Check if any stored refresh token matches the hash and is not expired
  return this.refreshTokens.some(
    (rt) => rt.tokenHash === tokenHash && rt.expiresAt > Date.now()
  );
};

// Method to remove a specific refresh token (e.g., on logout)
userSchema.methods.removeRefreshToken = async function (refreshToken) {
  // Hash the refresh token for comparison
  const tokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  // Remove token from the array if it matches the hash
  this.refreshTokens = this.refreshTokens.filter(
    (rt) => rt.tokenHash !== tokenHash
  );

  // Save the updated document to the database
  await this.save();
};

// Export the User model to be used in other parts of the app
module.exports = mongoose.model("User", userSchema);

// Helper function
function parseDuration(str) {
  const match = str.match(/(\d+)([smhd])/);
  if (!match) return 0;
  const num = parseInt(match[1]);
  const unit = match[2];
  switch (unit) {
    case "s":
      return num * 1000;
    case "m":
      return num * 60 * 1000;
    case "h":
      return num * 60 * 60 * 1000;
    case "d":
      return num * 24 * 60 * 60 * 1000;
    default:
      return 0;
  }
}
