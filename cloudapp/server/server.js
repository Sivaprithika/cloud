const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://dhanshree_db_user:dhanu666@cluster0.qp4k9nz.mongodb.net/cloudapp?appName=Cluster0")  
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log(error);
  });

const User = mongoose.model("User", {
  email: String,
  fileName: String
});

app.post("/users", async (req, res) => {
  const user = new User({
    email: req.body.email,
    fileName: req.body.fileName
  });

  await user.save();

  res.send("User data saved");
});

app.get("/users", async (req, res) => {
  const users = await User.find();

  res.json(users);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});