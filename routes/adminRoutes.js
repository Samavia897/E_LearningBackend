const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const router = express.Router();

// 🔹 Seed default admin (only once)
async function ensureDefaultAdmin() {
  try {
    const existingAdmin = await Admin.findOne();
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASS, 10);

      const defaultAdmin = new Admin({
        username: process.env.ADMIN_USER,
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin",
        status: "Active",
      });

      await defaultAdmin.save();
      console.log("✅ Default admin created:", defaultAdmin.username);
    } else {
      console.log("ℹ️ Admin already exists, skipping seeding...");
    }
  } catch (err) {
    console.error("❌ Error creating default admin:", err.message);
  }
}
ensureDefaultAdmin();

// 🔹 Admin Login
router.post("/login", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find admin by BOTH username and email
    const admin = await Admin.findOne({ username, email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid username or email" });
    }

    if (admin.status !== "Active") {
      return res.status(403).json({ message: "Admin account is inactive" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "✅ Login successful",
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        status: admin.status,
      },
    });
  } catch (error) {
    console.error("🔥 Login error:", error);
    res.status(500).json({ message: "❌ Login error", error: error.message });
  }
});

// 🔹 Change Password
router.put("/change-password", async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Compare old password
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedNewPassword;

    await admin.save();

    res.json({ message: "✅ Password updated successfully" });
  } catch (error) {
    console.error("🔥 Password change error:", error);
    res.status(500).json({ message: "❌ Error updating password", error: error.message });
  }
});

module.exports = router;
