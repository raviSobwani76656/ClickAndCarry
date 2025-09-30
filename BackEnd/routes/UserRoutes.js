const express = require("express");

const router = express.Router();

const {
  createAccount,
  login,
  logout,
  refreshToken,
} = require("../controllers/UserController");

router.use((req, res, next) => {
  console.log("📨 INCOMING REQUEST:");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("Path:", req.path);
  console.log("Original URL:", req.originalUrl);
  next();
});

router.post("/", createAccount);

router.post("/login", login);
router.post("/logout", logout);
router.post("/auth", refreshToken);

module.exports = router;
