const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendVerificationEmail = async (user) => {
  try {
    const emailToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const verificationUrl = `http://localhost:5000/api/users/verify-email?token=${emailToken}`;

    await transporter.sendMail({
      from: `"E-Learning" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Verify Your Email Address",
      html: `
        <div style="font-family: Arial, sans-serif; background: #f4f6f8; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); overflow: hidden;">

            <!-- Top gradient bar -->
            <div style="height: 8px; background: linear-gradient(90deg, #2563eb, #3b82f6);"></div>

            <!-- Content wrapper -->
            <div style="padding: 25px;">

              <!-- Logo -->
              <div style="text-align: center; margin-bottom: 25px;">
                <img src="https://res.cloudinary.com/dpwnzq5bt/image/upload/v1758561513/E_learning_profile_luqrdx.webp"
                     alt="E-Learning Logo"
                     style="width: 250px; max-width: 80%; height: auto; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);"/>
              </div>

              <!-- Title -->
              <h2 style="color: #111827; text-align: center; font-size: 28px; font-weight: 700; margin-bottom: 20px;">
                Verify Your Email
              </h2>

              <!-- Greeting -->
              <p style="font-size: 16px; color: #4b5563; line-height: 1.7; text-align: left; margin-bottom: 15px;">
                Hi <b>${user.name}</b>,
              </p>

              <!-- Message -->
              <p style="font-size: 15px; color: #4b5563; line-height: 1.7; text-align: left; margin-bottom: 25px;">
                Thank you for registering with <b>E-Learning</b>. Click the button below to verify your email and activate your account. This ensures your account is secure and ready to use.
              </p>

              <!-- Verify Button -->
              <div style="text-align: center; margin-bottom: 25px;">
                <a href="${verificationUrl}"
                   target="_blank"
                   style="
                     font-size: 16px;
                     font-weight: 600;
                     font-family: Arial, sans-serif;
                     color: #ffffff;
                     text-decoration: none;
                     padding: 14px 36px;
                     border-radius: 12px;
                     display: inline-block;
                     background: linear-gradient(90deg, #2563eb, #3b82f6);
                     box-shadow: 0 5px 20px rgba(59, 130, 246, 0.4);
                     transition: all 0.3s ease;
                   "
                   onmouseover="this.style.background='linear-gradient(90deg, #3b82f6, #2563eb)'; this.style.transform='scale(1.05)';"
                   onmouseout="this.style.background='linear-gradient(90deg, #2563eb, #3b82f6)'; this.style.transform='scale(1)';"
                >
                  Verify Email
                </a>
              </div>

              <!-- Note -->
              <p style="font-size: 14px; color: #6b7280; text-align: left;">
                If you did not sign up for E-Learning, please ignore this email. No action is required.
              </p>

            </div>

            <!-- Footer -->
            <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af;">
              © ${new Date().getFullYear()} E-Learning. All rights reserved.
            </div>

          </div>

          <!-- Responsive -->
          <style>
            @media only screen and (max-width: 600px) {
              div[style*='padding: 25px'] {
                padding: 20px !important;
              }
              h2 {
                font-size: 24px !important;
              }
              p {
                font-size: 15px !important;
              }
              a {
                font-size: 15px !important;
              }
            }
          </style>
        </div>
      `,
    });

    console.log("✅ Final modern verification email sent successfully!");
  } catch (error) {
    console.error("❌ Email sending error:", error);
  }
};
