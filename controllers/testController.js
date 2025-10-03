// backend/controllers/testController.js
const Test = require('../models/Test');

// Get all tests
exports.getAllTests = async (req, res) => {
  try {
    const tests = await Test.find().sort({ createdAt: 1 });
    res.json(tests);
  } catch (err) {
    console.error('Get tests error:', err);
    res.status(500).json({ error: 'Could not fetch tests' });
  }
};

// Create a test (admin)
exports.createTest = async (req, res) => {
  try {
    const { testId, title, description = '', price = 0, subject = '' } = req.body;
    if (!testId || !title) return res.status(400).json({ error: 'testId and title required' });

    const existing = await Test.findOne({ testId });
    if (existing) return res.status(409).json({ error: 'Test with this testId already exists' });

    const newTest = new Test({ testId, title, description, price, subject });
    await newTest.save();
    res.status(201).json(newTest);
  } catch (err) {
    console.error('Create test error:', err);
    res.status(500).json({ error: 'Could not create test' });
  }
};

// Get test by testId
exports.getTestByTestId = async (req, res) => {
  try {
    const { testId } = req.params;
    const test = await Test.findOne({ testId });
    if (!test) return res.status(404).json({ error: 'Test not found' });
    res.json(test);
  } catch (err) {
    console.error('Get test error:', err);
    res.status(500).json({ error: 'Could not fetch test' });
  }
};
