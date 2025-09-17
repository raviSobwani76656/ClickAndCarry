const mongoose = require("mongoose");

require("dotenv").config();

// Connect to MongoDB using Mongoose
mongoose
  .connect(process.env.mongoURI, {
    useNewUrlParser: true, // Use the new URL parser (avoids deprecation warnings)
    useUnifiedTopology: true, // Use the new unified topology engine (more reliable connection)
  })
  .then(() => {
    console.log("MongoDB Connection Successful");
  })
  .catch((err) => {
    console.log("MongoDB Connection Failed Due to Error:", err);
  });

module.exports = mongoose;
