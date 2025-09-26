const express = require("express");

const router = express.Router();

const {
  createAccount,
  login,
  logout,
} = require("../controllers/UserController");

router.post("/", createAccount);

router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
