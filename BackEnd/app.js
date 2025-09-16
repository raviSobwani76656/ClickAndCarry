require("./config/db");
const express = require("express");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("HEllo There");
});

module.exports = app;
