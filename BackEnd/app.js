require("./config/db");
const express = require("express");
const app = express();
const helmet = require("helmet");
const cookieparser = require("cookieparser");

app.use(express.json()); //It tells Express: Whenever a request comes in with a JSON body, automatically parse it into a JavaScript object and put it inside req.body.”
app.use(helmet()); //A middleware that sets HTTP headers to protect your app from common web vulnerabilities.
app.use(cookieparser()); //Middleware that parses cookies attached to incoming requests.
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
// Routes
const userRoutes = require("./routes/UserRoutes");
const productRoutes = require("./routes/ProductRoutes");
const categoryRoutes = require("./routes/CategoryRoutes");
const orderRoutes = require("./routes/OrderRoutes");
const cartRoutes = require("./routes/CartRoutes");

app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/category", categoryRoutes);
app.use("/order", orderRoutes);
app.use("./cart", cartRoutes);

// Test endpoint
app.get("/", (req, res) => {
  res.send("Hello There");
});

module.exports = app;
