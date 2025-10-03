const nodemailer = require("nodemailer");
require("dotenv").config();

// Transporter create only once
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send Email Utility
 * @param {Object} options
 * @param {string} options.to - Receiver email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email body (HTML)
 * @param {string} [options.from] - Sender email (default: EMAIL_USER)
 */
const sendEmail = async ({ to, subject, html, from }) => {
  try {
    const mailOptions = {
      from: from || process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${info.response}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    return false;
  }
};

module.exports = sendEmail;
