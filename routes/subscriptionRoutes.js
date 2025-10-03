// backend/routes/subscriptionRoute.js (UPDATED with Admin Approval)

const express = require("express");
const router = express.Router();
const ctr = require("../controllers/subscriptionController");
const { authMiddleware, adminMiddleware: isAdmin } = require("../middleware/authMiddleware");

router.get("/check-status/:testId", authMiddleware, ctr.checkSubscriptionStatus);
router.post("/create-payment-intent", authMiddleware, ctr.createPaymentIntent);
router.post("/", authMiddleware, ctr.createSubscription);

// ⭐️ NEW: Route to fetch all subscriptions for Admin
router.get("/all", authMiddleware, isAdmin, ctr.getAllSubscriptions);

// ⭐️ NEW: Admin can approve/reject/update local payments
router.patch("/:id/status", authMiddleware, isAdmin, ctr.updateSubscriptionStatus);

module.exports = router;
