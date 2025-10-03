// 📁 backend/middleware/authMiddleware.js (FINAL FIXED VERSION)

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // User object ko attach karein
    req.user = { 
        ...user.toObject(), 
        id: user._id.toString() 
    };

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

const isAdmin = (req, res, next) => {
  // Check karta hai ke req.user set hai aur role 'admin' hai
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied, Admins only" });
  }
  next();
};

// ⭐️ FIX: isAdmin ko 'adminMiddleware' ke naam se export kar diya
module.exports = { 
    authMiddleware, 
    adminMiddleware: isAdmin 
};