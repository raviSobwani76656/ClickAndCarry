require("./config/db");
const express = require("express");
const cors = require("cors");
const app = express();
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

app.use(express.json()); //It tells Express: Whenever a request comes in with a JSON body, automatically parse it into a JavaScript object and put it inside req.body.”

app.use(express.urlencoded({ extended: true }));
// Routes
app.use(helmet()); //A middleware that sets HTTP headers to protect your app from common web vulnerabilities.
app.use(cookieParser()); //Middleware that parses cookies attached to incoming requests.
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const userRoutes = require("./routes/UserRoutes");
const productRoutes = require("./routes/ProductRoutes");
const categoryRoutes = require("./routes/CategoryRoutes");
const orderRoutes = require("./routes/OrderRoutes");
const cartRoutes = require("./routes/CartRoutes");
const reviewRoutes = require("./routes/ReviewRoutes");
const discountRoutes = require("./routes/DiscountRoutes");

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/categorys", categoryRoutes);
app.use("/orders", orderRoutes);
app.use("/carts", cartRoutes);
app.use("/reviews", reviewRoutes);
app.use("/discounts", discountRoutes);

console.log("discountRoutes", discountRoutes);

// Test endpoint
app.get("/", (req, res) => {
  res.send("Hello There");
});

module.exports = app;
