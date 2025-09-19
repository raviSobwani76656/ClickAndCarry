require("./config/db");
const express = require("express");
const app = express();

app.use(express.json());

// Routes
const userRoutes = require("./routes/UserRoutes");
const productRoutes = require("./routes/ProductRoutes");
const categoryRoutes = require("./routes/CategoryRoutes");
const orderRoutes = require("./routes/OrderRoutes");

app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/category", categoryRoutes);
app.use("/order", orderRoutes);

// Test endpoint
app.get("/", (req, res) => {
  res.send("Hello There");
});

module.exports = app;
