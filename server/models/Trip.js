const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
    destination: {
        type: String,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    days: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Trip", tripSchema);