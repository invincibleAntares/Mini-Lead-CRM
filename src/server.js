require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

// Connect to MongoDB
connectDB();

const app = express();

app.use(express.json());


app.get("/health", (req, res) => {
  res.json({ message: "Server is online" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});