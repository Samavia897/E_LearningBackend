// backend/models/Subscription.js
const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    testId: { type: String, required: true }, // now a string to match frontend "1","2"
    title: { type: String, required: true },
    price: { type: Number, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    paymentMethod: { type: String, required: true }, // 'Credit/Debit Card','Easypaisa',...
    extraInfo: { type: String }, // mobile number or transaction id
    paymentIntentId: { type: String }, // stripe intent id
    cardLast4: { type: String },
    cardBrand: { type: String },
    status: { type: String, enum: ['pending','paid','failed'], default: 'pending' },
    transactionId: { type: String } // unify transaction id or stripe id
  },
  { timestamps: true }
);

// ensure unique subscription per user per test
subscriptionSchema.index({ userId: 1, testId: 1 }, { unique: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);
