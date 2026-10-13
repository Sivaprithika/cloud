const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://cloudapp-3163d.web.app"
  ]
}));

app.use(express.json());

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Atlas connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

// User schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("User", userSchema, "users");

// Test route
app.get("/", (req, res) => {
  res.send("Cloud File App backend is running!");
});

// Save user and file details
app.post("/users", async (req, res) => {
  try {
    const { email, fileName } = req.body;

    if (!email) {
      return res.status(400).send("Email is required");
    }

    const newUser = new User({
      email,
      fileName: fileName || ""
    });

    await newUser.save();

    res.status(201).send("Data saved to MongoDB Atlas successfully!");
  } catch (error) {
    console.error("Save error:", error);
    res.status(500).send("Failed to save data to MongoDB Atlas");
  }
});

// Start backend server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
