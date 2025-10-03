// 📁 backend/routes/userRoutes.js (FINAL UPDATED VERSION)

const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  adminLogin,
  verifyEmail,
  getUsers,
  addUser,
  deleteUser,
  logout, 
  getCurrentUser,
  // ⭐️ 1. NEW IMPORT: Role update function ko import karain
  updateUserRole, 
} = require("../controllers/userController");
// ⭐️ 2. IMPORT FIX: isAdmin ki jagah ab adminMiddleware use hoga
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware"); 

// 🔹 Auth Routes
router.post("/signup", signup);
router.get("/verify-email", verifyEmail);
router.post("/login", login); 
router.post("/logout", logout); 

// ⭐️ NEW ROUTE: Dedicated Admin Login
router.post("/admin/login", adminLogin);

// ⭐️ Get Current Authenticated User Information 
router.get("/me", authMiddleware, getCurrentUser); 

// 🔹 User Management (Protected: Admin only)
router.get("/", authMiddleware, adminMiddleware, getUsers);
router.post("/", authMiddleware, adminMiddleware, addUser);
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);

// ⭐️ NEW SECURED ROUTE: Role Update
// Yeh route sirf Admin hi chala sakta hai (authMiddleware + adminMiddleware)
router.put(
    "/role/:id", 
    authMiddleware, 
    adminMiddleware, 
    updateUserRole // ⭐️ Controller function
);

module.exports = router;