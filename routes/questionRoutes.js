const express = require("express");
const router = express.Router();
const {
  addQuestion,
  getQuestionsBySubject,
  deleteQuestion,
  getQuestionsCount,
} = require("../controllers/questionController");

// Routes
router.post("/", addQuestion);
router.get("/count", getQuestionsCount);

// ✅ Get questions for a subject by param
router.get("/:subject", getQuestionsBySubject);

router.delete("/:id", deleteQuestion);

module.exports = router;
