// User email template
module.exports = (data) => {
  const { name, title, message } = data;

  return {
    subject: `✅ Thanks for Contacting Us, ${name}!`,
    html: `
      <div style="font-family: Arial, sans-serif; background: #f9fafc; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          
          <div style="background: linear-gradient(135deg, #43cea2, #185a9d); color: #fff; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">Thank You, ${name}!</h2>
          </div>
          
          <div style="padding: 20px; color: #333;">
            <p>We have received your message and our team will get back to you soon.</p>
            
            <div style="background: #f4f6f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>📝 Title:</strong> ${title}</p>
              <p><strong>💬 Message:</strong><br/> ${message}</p>
            </div>
            
            <p>Meanwhile, feel free to reply to this email if you need urgent support.</p>
          </div>
          
          <div style="background: #f9fafc; text-align: center; padding: 15px; font-size: 12px; color: #888;">
            <p>© ${new Date().getFullYear()} Your Website. All rights reserved.</p>
          </div>
        </div>
      </div>
    `
  };
};
