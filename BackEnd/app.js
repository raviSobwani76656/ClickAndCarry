require("./config/db");
const express = require("express");
const app = express();
app.use(express.json());
const userRoutes = require("./routes/UserRoutes");
const productRoutes = require("./routes/ProductRoutes");

app.use("/user", userRoutes);
app.use("./product", productRoutes);

app.get("/", (req, res) => {
  res.send("HEllo There");
});

module.exports = app;
