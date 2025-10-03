// Admin email template (modern stylish version)
module.exports = (data) => {
  const { name, email, role, info, title, message } = data;

  return {
    subject: `📩 New Contact Message: ${title}`,
    html: `
      <div style="margin:0; padding:20px; background:#f0f2f5; font-family:'Segoe UI',Roboto,Arial,sans-serif; color:#333;">
        <div style="max-width:600px; margin:auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 6px 16px rgba(0,0,0,0.1);">

          <!-- Header -->
          <div style="background:linear-gradient(135deg, #6a11cb, #2575fc); color:#fff; padding:25px; text-align:center;">
            <h1 style="margin:0; font-size:24px; font-weight:700;">📨 New Contact Submission</h1>
            <p style="margin:5px 0 0; font-size:14px; opacity:0.9;">A visitor has reached out via your website</p>
          </div>

          <!-- Body -->
          <div style="padding:25px;">
            <h2 style="margin-top:0; font-size:20px; color:#444;">Contact Details</h2>
            <table style="width:100%; border-collapse:collapse; margin-top:10px;">
              <tr>
                <td style="padding:8px; font-weight:600; width:120px;">👤 Name:</td>
                <td style="padding:8px; background:#fafafa; border-radius:6px;">${name}</td>
              </tr>
              <tr>
                <td style="padding:8px; font-weight:600;">📧 Email:</td>
                <td style="padding:8px; background:#fafafa; border-radius:6px;">${email}</td>
              </tr>
              <tr>
                <td style="padding:8px; font-weight:600;">🎭 Role:</td>
                <td style="padding:8px; background:#fafafa; border-radius:6px;">${role}</td>
              </tr>
              <tr>
                <td style="padding:8px; font-weight:600;">ℹ️ Info:</td>
                <td style="padding:8px; background:#fafafa; border-radius:6px;">${info}</td>
              </tr>
              <tr>
                <td style="padding:8px; font-weight:600;">📝 Title:</td>
                <td style="padding:8px; background:#fafafa; border-radius:6px;">${title}</td>
              </tr>
            </table>

            <div style="margin-top:20px;">
              <h3 style="font-size:18px; margin-bottom:10px; color:#444;">💬 Message:</h3>
              <div style="background:#f9f9f9; padding:15px; border-left:4px solid #2575fc; border-radius:6px; line-height:1.6;">
                ${message}
              </div>
            </div>

            <!-- Action Button -->
            <div style="text-align:center; margin-top:30px;">
              <a href="mailto:${email}" 
                 style="display:inline-block; background:linear-gradient(135deg,#2575fc,#6a11cb); color:#fff; text-decoration:none; 
                        padding:12px 24px; border-radius:8px; font-weight:600; font-size:15px; box-shadow:0 3px 6px rgba(0,0,0,0.1);">
                📩 Reply to ${name}
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background:#f8f9fa; padding:15px; text-align:center; font-size:12px; color:#888;">
            <p style="margin:0;">⚡ This is an automated email from your website’s contact form.</p>
            <p style="margin:5px 0 0;">© ${new Date().getFullYear()} Your Website. All rights reserved.</p>
          </div>
        </div>
      </div>
    `,
  };
};
