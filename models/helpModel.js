// models/Help.js
const mongoose = require("mongoose");

const helpSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["pending", "resolved"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
} ,  { timestamps: true });

module.exports = mongoose.model("Help", helpSchema);