const mongoose = require("mongoose");
const express = require("express");

// Models
const Patient = require("./models/patient");

const app = express();
app.use(express.json());

const uri = "mongodb://localhost:27017/healthcare";

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => console.log("✅ Database is Connected"))
  .catch(err => console.error("❌ Error connecting to MongoDB:", err));



app.listen(5000, () => {
  console.log("🚀 Server Running at Port 5000");
});
