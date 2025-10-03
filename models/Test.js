// backend/models/Test.js
const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  testId: { type: String, required: true, unique: true }, // e.g. "1", "2", "math101"
  title: { type: String, required: true },
  description: { type: String, default: "" },
  price: { type: Number, default: 0 },
  subject: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Test", testSchema);
