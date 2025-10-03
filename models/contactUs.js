const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    role: { type: String, required: true },
    info: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);