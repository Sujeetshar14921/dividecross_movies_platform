const nodemailer = require("nodemailer");

// Configure Brevo SMTP transporter
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_EMAIL,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

// Send Support Ticket Email
exports.sendSupportTicketEmail = async (email, ticketId, subject, message) => {
  try {
    const mailOptions = {
      from: `"DivideCross Support" <${process.env.BREVO_EMAIL}>`,
      to: email,
      subject: `Support Ticket #${ticketId} - ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { text-align: center; color: #dc2626; margin-bottom: 30px; }
            .ticket-id { background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>DivideCross Support</h1>
            </div>
            
            <p>Hello,</p>
            <p>Your support ticket has been received successfully!</p>
            
            <div class="ticket-id">
              <strong>Ticket ID:</strong> #${ticketId}<br/>
              <strong>Subject:</strong> ${subject}
            </div>
            
            <p>We'll review your message and respond as soon as possible.</p>
            <p><strong>Your Message:</strong></p>
            <p>${message}</p>
            
            <div class="footer">
              <p>© 2025 DivideCross. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Support Ticket #${ticketId} - ${subject}\n\nYour message: ${message}\n\nWe'll respond soon.`,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    throw new Error(`Failed to send support email: ${error.message}`);
  }
};
