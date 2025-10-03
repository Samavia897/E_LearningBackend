import Result from "../models/Result.js";

// ✅ Get all results
export const getResults = async (req, res) => {
  try {
    const results = await Result.find().sort({ date: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch results" });
  }
};

// ✅ Save new result
export const saveResult = async (req, res) => {
  try {
    const newResult = new Result(req.body);
    await newResult.save();
    res.status(201).json({ message: "Result saved successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save result" });
  }
};

// ✅ Delete a result
export const deleteResult = async (req, res) => {
  try {
    await Result.findByIdAndDelete(req.params.id);
    res.json({ message: "Result deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete result" });
  }
};
