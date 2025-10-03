// backend/routes/testRoute.js
const express = require("express");
const router = express.Router();
const ctr = require("../controllers/testController");
const { authMiddleware, adminMiddleware: isAdmin } = require("../middleware/authMiddleware");

// public: get all tests
router.get("/", ctr.getAllTests);
// public: get test by testId
router.get("/:testId", ctr.getTestByTestId);

// admin: create test
router.post("/", authMiddleware, isAdmin, ctr.createTest);

module.exports = router;
