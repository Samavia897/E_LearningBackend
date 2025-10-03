const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  statement: { type: String, required: true },
  options: [{ type: String, required: true }],
  correct: { type: String, required: true },
});

module.exports = mongoose.model("Question", QuestionSchema);
