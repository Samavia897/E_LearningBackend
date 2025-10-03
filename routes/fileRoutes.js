const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/:filename", async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(process.cwd(), "uploads", filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filename).toLowerCase();

    const mimeTypes = {
      ".pdf": "application/pdf",
      ".txt": "text/plain",
      ".md": "text/markdown",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
    };

    res.setHeader("Content-Type", mimeTypes[ext] || "application/octet-stream");
    res.setHeader("Content-Disposition", "inline");
    res.send(fileBuffer);
  } catch (error) {
    res.status(500).json({ error: "Failed to serve file" });
  }
});

module.exports = router;
