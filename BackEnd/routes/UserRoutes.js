const express = require("express");

const router = express.Router();

const {
  createAccount,
  login,
  logout,
} = require("../controllers/UserController");

router.post("/createAccount", createAccount);

router.post("/login", login);
router.post("/logut", logout);

module.exports = router;
