const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  user: { type: String, required: true },
  test: { type: String, required: true },
  correct: { type: Number, required: true },
  total: { type: Number, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
});

module.exports = mongoose.model("Result", resultSchema);
