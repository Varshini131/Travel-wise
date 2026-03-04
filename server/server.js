const Trip = require("./models/Trip");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("TravelWise AI Server Running 🚀");
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error:", err));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
app.get("/test", async (req, res) => {
    res.json({ message: "TravelWise Backend is Working with MongoDB 🚀" });
});
app.post("/add-trip", async (req, res) => {
    try {
        const { destination, budget, days } = req.body;

        const newTrip = new Trip({
            destination,
            budget,
            days
        });

        await newTrip.save();

        res.status(201).json({
            message: "Trip saved successfully 🚀",
            trip: newTrip
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});