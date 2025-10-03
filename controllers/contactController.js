const Message = require("../models/contactUs");
const sendEmail = require("../utils/sendEmail"); // reusable email sender
const adminTemplate = require("../emails/adminTemplate"); // admin template
const userTemplate = require("../emails/userTemplate");   // user template
const contactSchema = require("../validators/contactValidator");  //import Validator

// --- Controller Function to Submit a New Message (POST) ---
exports.submitMessage = async (req, res) => {
  try {
    const { error } = contactSchema.validate(req.body); //  validate incoming data

    if (error) {
      return res
        .status(400)
        .json({ success: false, error: error.details[0].message });
    }

    const { role, info, name, email, title, message } = req.body;

    // 1. Save the message to the database
    const newMessage = new Message({ role, info, name, email, title, message });
    await newMessage.save();

    // 2. Send email to the website admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      ...adminTemplate({ name, email, role, info, title, message }),
    });

    // 3. Send a confirmation email to the user
    await sendEmail({
      to: email,
      ...userTemplate({ name, title, message }),
    });

    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully!",
    });
  } catch (error) {
    console.error("Error submitting message:", error);
    res.status(500).json({
      success: false,
      error: "Server error. Could not send message.",
    });
  }
};

// --- Controller Function to Get All Messages (GET) ---
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      success: false,
      error: "Server error. Could not fetch messages.",
    });
  }
};

// --- Controller Function to Get a Single Message by ID (GET) ---
exports.getMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findById(id);
    if (!message) {
      return res
        .status(404)
        .json({ success: false, error: "Message not found." });
    }
    res.status(200).json({ success: true, data: message });
  } catch (error) {
    console.error("Error fetching message by ID:", error);
    res.status(500).json({
      success: false,
      error: "Server error. Invalid ID or failed to fetch message.",
    });
  }
};

// --- Controller Function to Update a Message (PUT) ---
exports.updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMessage = await Message.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedMessage) {
      return res
        .status(404)
        .json({ success: false, error: "Message not found." });
    }
    res.status(200).json({
      success: true,
      message: "Message updated successfully.",
      data: updatedMessage,
    });
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).json({
      success: false,
      error: "Server error. Failed to update message.",
    });
  }
};

// --- Controller Function to Delete a Message (DELETE) ---
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMessage = await Message.findByIdAndDelete(id);
    if (!deletedMessage) {
      return res
        .status(404)
        .json({ success: false, error: "Message not found." });
    }
    res
      .status(200)
      .json({ success: true, message: "Message deleted successfully." });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({
      success: false,
      error: "Server error. Failed to delete message.",
    });
  }
};
