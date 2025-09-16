const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("HEllo There");
});

module.exports = app;
