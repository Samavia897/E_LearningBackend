// backend/emails/templates/paymentTemplate.js

module.exports = ({ name, title, price, transactionId, status }) => {
  // Conditions
  const isPaid = status === "paid";
  const isPending = status === "pending";
  const isFailed = status === "failed";

  // Dynamic Variables
  let subject = "Payment Update";
  let mainHeading = "Payment Status";
  let message = "";
  let statusColor = "#0c5460"; // default: info
  let statusBg = "#d1ecf1";

  if (isPaid) {
    subject = "🎉 Payment Successful - Access Granted";
    mainHeading = "Payment Successful!";
    message = `
      Dear <b>${name}</b>,<br><br>
      Your payment for <b>${title}</b> has been <span style="color:green;">successfully completed</span>.
      You now have full access to the test.<br><br>
      Transaction ID: <b>${transactionId}</b><br>
      Amount Paid: <b>${price} PKR</b>
    `;
    statusColor = "#155724";
    statusBg = "#d4edda";
  } 
  else if (isPending) {
    subject = "⏳ Payment Pending - Under Review";
    mainHeading = "Payment Pending!";
    message = `
      Dear <b>${name}</b>,<br><br>
      We have received your payment request for <b>${title}</b>. 
      Currently, it is <span style="color:orange;">under review</span>.<br><br>
      Transaction ID: <b>${transactionId}</b><br>
      Amount: <b>${price} PKR</b><br><br>
      You will be notified once it is confirmed.
    `;
    statusColor = "#856404";
    statusBg = "#fff3cd";
  } 
  else if (isFailed) {
    subject = "❌ Payment Failed - Action Required";
    mainHeading = "Payment Failed!";
    message = `
      Dear <b>${name}</b>,<br><br>
      Unfortunately, your payment for <b>${title}</b> <span style="color:red;">could not be processed</span>.<br><br>
      Transaction ID: <b>${transactionId}</b><br>
      Amount Attempted: <b>${price} PKR</b><br><br>
      Please try again or contact support for assistance.
    `;
    statusColor = "#721c24";
    statusBg = "#f8d7da";
  } 
  else {
    // fallback
    subject = "⚠️ Payment Status Update";
    mainHeading = "Payment Update";
    message = `
      Dear <b>${name}</b>,<br><br>
      We received an update regarding your payment for <b>${title}</b>.
      Current Status: <b>${status}</b>.<br><br>
      Transaction ID: <b>${transactionId}</b>
    `;
  }

  // Return HTML
  return {
    subject,
    html: `
      <div style="max-width:600px;margin:0 auto;padding:20px;font-family:Arial,sans-serif;background:#f4f4f4;">
        <div style="background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
          
          <div style="background:#2563eb;color:#fff;padding:15px;text-align:center;">
            <h2 style="margin:0;">${mainHeading}</h2>
          </div>
          
          <div style="padding:20px;color:#333;">
            <p>${message}</p>
            
            <div style="margin-top:20px;padding:15px;background:${statusBg};color:${statusColor};border-radius:8px;text-align:center;font-size:16px;font-weight:bold;">
              STATUS: ${status.toUpperCase()}
            </div>
            
            <p style="margin-top:30px;font-size:14px;color:#555;">
              Thank you for using our platform.<br>
              If you face any issue, feel free to contact support.
            </p>
          </div>
        </div>
      </div>
    `
  };
};
