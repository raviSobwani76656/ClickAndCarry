const express = require("express");

const router = express.Router();

const {
  createAccount,
  login,
  logout,
  refreshToken,
} = require("../controllers/UserController");


router.post("/", createAccount);

router.post("/login", login);
router.post("/logout", logout);
router.post("/auth", refreshToken);

module.exports = router;
