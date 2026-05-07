require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
const itemRoutes = require("./routes/items");
const tradeRoutes = require("./routes/trades");

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/trades", tradeRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});