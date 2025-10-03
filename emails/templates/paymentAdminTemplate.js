// backend/emails/templates/paymentAdminTemplate.js (FIXED VERSION)

module.exports = ({ name, email, title, price, paymentMethod, transactionId, status }) => {
    
    // Status ke liye colors define kar diye hain for cleaner code
    const statusColor = 
        status === 'paid' ? '#28a745' : // Green for paid
        status === 'failed' ? '#dc3545' : // Red for failed
        '#ffc107'; // Yellow for pending
    
    const statusBg = 
        status === 'paid' ? '#d4edda' : 
        status === 'failed' ? '#f8d7da' : 
        '#fff3cd'; 

    // ⭐️ FIX: Dynamic Subject and Main Message based on Status
    const statusPrefix = 
        status === 'paid' ? '✅ PAID' : 
        status === 'pending' ? '⏳ PENDING' : 
        '❌ FAILED';
    
    const subjectText = `${statusPrefix} Subscription: ${title} via ${paymentMethod}`;

    let mainMessage = '';
    let notificationColor = '';

    if (status === 'paid') {
        mainMessage = 'This payment was processed successfully (usually via Card). No immediate action is required.';
        notificationColor = '#28a745'; // Green
    } else if (status === 'pending') {
        mainMessage = `**ACTION REQUIRED:** This is a **manual payment** via ${paymentMethod}. Please verify the transaction ID/Mobile number (${transactionId || 'N/A'}) and update the subscription status to 'paid' in the admin panel.`;
        notificationColor = '#ffc107'; // Yellow
    } else {
        mainMessage = 'This payment attempt failed or is marked as failed. Review transaction details for necessary follow-up.';
        notificationColor = '#dc3545'; // Red
    }
        
    return {
        subject: subjectText,
        html: `
            <div style="font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; background-color: #f0f4f8; padding: 20px; text-align: center;">
                <div style="max-width: 550px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);">
                    
                    <div style="background-color: ${notificationColor}; color: white; padding: 25px 20px; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px; font-weight: 600;">${statusPrefix} Subscription Alert</h1>
                        <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.9;">A new payment has been processed on the IELTS Platform.</p>
                    </div>

                    <div style="padding: 30px 25px; text-align: left; color: #333333;">
                        <p style="font-size: 16px; margin-top: 0; color: #333; font-weight: 500;">
                           ${mainMessage.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
                        </p>

                        <h3 style="color: #007bff; margin-top: 30px; margin-bottom: 20px; border-bottom: 2px solid #eef1f4; padding-bottom: 10px;">Transaction Summary</h3>
                        
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 15px; line-height: 1.6; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 10px 0; width: 40%; font-weight: bold; color: #555;">User Name:</td>
                                <td style="padding: 10px 0; width: 60%; color: #333;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; font-weight: bold; color: #555;">User Email:</td>
                                <td style="padding: 10px 0; color: #007bff; text-decoration: none;">${email}</td>
                            </tr>
                            <tr><td colspan="2" style="padding: 5px 0;"><hr style="border: none; border-top: 1px dashed #e9ecef;"></td></tr>
                            <tr>
                                <td style="padding: 10px 0; font-weight: bold; color: #555;">Subscription/Test:</td>
                                <td style="padding: 10px 0; color: #333;">${title}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; font-weight: bold; color: #555;">Amount Paid:</td>
                                <td style="padding: 10px 0; color: ${statusColor}; font-weight: bold; font-size: 16px;">$${price}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; font-weight: bold; color: #555;">Payment Method:</td>
                                <td style="padding: 10px 0; color: #333;">${paymentMethod}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; font-weight: bold; color: #555;">Transaction ID/Number:</td>
                                <td style="padding: 10px 0; color: #333;">${transactionId || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; font-weight: bold; color: #555;">Status:</td>
                                <td style="padding: 10px 0; color: #333;">
                                    <span style="background-color: ${statusBg}; color: ${statusColor}; padding: 5px 10px; border-radius: 6px; font-weight: 700; text-transform: uppercase; display: inline-block;">
                                        ${status}
                                    </span>
                                </td>
                            </tr>
                        </table>
                        
                        <p style="text-align: center; margin-top: 30px; font-size: 14px; color: #6c757d;">
                            <a href="[YOUR_ADMIN_DASHBOARD_LINK]" style="color: #007bff; text-decoration: none; font-weight: 600;">Go to Admin Dashboard</a>
                        </p>

                    </div>

                    <div style="background-color: #f8f9fa; padding: 15px; font-size: 12px; text-align: center; color: #777; border-top: 1px solid #e9ecef;">
                        <p style="margin: 0;">This is an automated administrative payment notification email. Please do not reply to this email.</p>
                    </div>
                </div>
            </div>
        `
    };
};