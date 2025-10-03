// index.js / server.js (UPDATED & FIXED)

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // ⭐️ NEW: Required for res.cookie() and req.cookies
const connectDB = require("./config/database");

// Import routes
const courseRoutes = require("./routes/courseRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const userRoutes = require("./routes/userRoutes");
const contactRoutes = require("./routes/contactRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const questionRoutes = require("./routes/questionRoutes"); 
const resultRoutes = require("./routes/resultRoutes.js");
const testRoutes = require("./routes/testRoutes");
const fileRoutes = require('./routes/fileRoutes.js');
const adminRoutes = require("./routes/adminRoutes.js");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176"
];

// --- ⭐️ FIXED & CLEANED CORS CONFIGURATION ---
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`CORS blocked: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // 👈 MUST: Is se aapka frontend cookie bhej aur receive kar payega
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}));
// ---------------------------------------------

// ✅ Middleware
app.use(express.json());
app.use(cookieParser()); // ⭐️ NEW: Use cookie-parser

// DB Connection
connectDB();

// Routes
app.use("/api/courses", courseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/questions", questionRoutes); 
app.use("/api/results", resultRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/files", fileRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/admin", adminRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("✅ Server is running fine!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
