const express = require('express');
const { getResults, saveResult, deleteResult } =require ("../controllers/resultController.js");

const router = express.Router();

// GET all results
router.get("/", getResults);

// POST new result
router.post("/", saveResult);

// DELETE result
router.delete("/:id", deleteResult);

module.exports = router;

