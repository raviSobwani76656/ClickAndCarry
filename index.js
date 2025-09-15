const express = require("express");

const app = express();
const PORT = 5000;

app.get("/", (req, res) => {
  res.send("Hey Nigga");
});
app.listen(PORT, () => {
  console.log(`Server is runnig at PORt ${PORT}`);
});
