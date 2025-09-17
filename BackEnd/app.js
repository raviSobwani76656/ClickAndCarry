require("./config/db");
const express = require("express");
const app = express();
app.use(express.json());
const userRoutes = require("./routes/UserRoutes");

app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.send("HEllo There");
});

module.exports = app;
