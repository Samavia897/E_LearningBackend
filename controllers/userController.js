const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../utils/emailService");

//  Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    // Send verification email
    try {
      await sendVerificationEmail(newUser);
    } catch (emailError) {
      console.error("Email sending error:", emailError.message);
      return res.status(500).json({ message: "User created but email sending failed", error: emailError.message });
    }

    // Important: Do NOT redirect to login here
    res.status(201).json({ message: "Signup successful! Please check your email to verify your account." });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};


exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).send("No token provided");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(400).send("Invalid token");

    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    //  Redirect to frontend email verified page
    return res.redirect(`http://localhost:5173/email-verified`);
  } catch (error) {
    console.error("Email verification failed:", error);
    res.status(500).send("Email verification failed ❌");
  }
};



//  Login (fixed)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email first" });
    }

    // Fix: use "id" instead of "userId"
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};



//  NEW: Admin Specific Login (FINAL ROBUST VERSION)
exports.adminLogin = async (req, res) => {
    try {
        // Frontend ab 'email' bhej raha hai, lekin robustness ke liye dono fields accept karein
        const { email, password, username } = req.body; 

        // Login ke liye email ko use karein
        const loginIdentifier = email || username; // Agar email nahi aaya, toh username use karein (Robustness)

        if (!loginIdentifier || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        //  FIX: Database mein email field se search karein
        const user = await User.findOne({ email: loginIdentifier }); 
        if (!user) return res.status(400).json({ message: "User not found" });

       const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        //  IMPORTANT: Check if the user has the 'admin' role
        if (user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Not an Admin user." });
        }
        
        // Token generate karein (role ke saath)
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({
            message: "Admin Login successful",
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });

    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ message: "Admin Login failed", error: error.message });
    }
};


//  NEW: Update User Role (Securely)
exports.updateUserRole = async (req, res) => {
    try {
        // 1. Authorization middleware se check hoga ke yeh request Admin ne ki hai.
        
        const userId = req.params.id;
        // Frontend se aana chahiye: { newRole: "admin" } ya { newRole: "student" }
        const { newRole } = req.body; 

        //  FIX: 'teacher' role ko validation list mein shamil kiya
        if (!newRole || !['admin', 'teacher', 'student'].includes(newRole)) {
            return res.status(400).json({ message: "Invalid role specified (must be admin, teacher, or student)." });
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User to update not found." });
        }

        // 2. Role update karein
        user.role = newRole;
        await user.save();

        res.status(200).json({ 
            message: `User role updated to ${newRole} successfully.`, 
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });

    } catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).json({ message: "Role update failed due to a server error.", error: error.message });
    }
};




//  Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

//  Add new user manually
exports.addUser = async (req, res) => {
  try {
    const { name, email, role, status } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({
      name,
      email,
      password: "12345", // default password
      role: role || "student",
      status: status || "Active",
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: "Error adding user", error: error.message });
  }
};

//  Delete user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.logout = async (req, res) => { // ⭐️ Make it async
    try {
        // 1. Agar aap req.user se user ID access kar sakte hain (agar authMiddleware use ho),
        // toh refresh token ko DB se clear kar dein.
        if (req.user && req.user.id) {
            await User.findByIdAndUpdate(req.user.id, { refreshToken: null });
        }
        
        // 2. Cookie ko clear/expire kar dein
        res.cookie('token', 'none', { 
            expires: new Date(Date.now() + 5 * 1000), 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict',
        });

        res.status(200).json({ message: "Logout successful and token revoked" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Server error during logout" });
    }
};