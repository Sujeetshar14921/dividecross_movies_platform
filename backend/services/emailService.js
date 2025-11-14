const sgMail = require('@sendgrid/mail');

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send OTP Email using SendGrid
 * @param {string} email - Recipient email
 * @param {string} otp - 6-digit OTP code
 * @param {string} subject - Email subject
 */
const sendOtpEmail = async (email, otp, subject) => {
  try {
    console.log(`📧 Attempting to send email to: ${email}`);
    console.log(`📧 Using SendGrid API`);

    const msg = {
      to: email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'noreply@cineverse.com',
        name: 'CineVerse'
      },
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { text-align: center; color: #dc2626; margin-bottom: 30px; }
            .header h1 { margin: 0; font-size: 28px; }
            .otp-box { background: linear-gradient(135deg, #dc2626, #ec4899); color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .otp-code { font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 10px 0; }
            .info { color: #666; font-size: 14px; line-height: 1.6; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎬 CineVerse</h1>
              <p>Your Movie Streaming Platform</p>
            </div>
            
            <div class="otp-box">
              <p style="margin: 0; font-size: 16px;">Your OTP Code</p>
              <div class="otp-code">${otp}</div>
              <p style="margin: 0; font-size: 14px;">Valid for 5 minutes</p>
            </div>
            
            <div class="info">
              <p>Hello,</p>
              <p>You've requested to verify your account on CineVerse. Please use the OTP code above to complete your registration.</p>
              <p><strong>Important:</strong> This code will expire in 5 minutes. Do not share this code with anyone.</p>
              <p>If you didn't request this code, please ignore this email.</p>
            </div>
            
            <div class="footer">
              <p>© 2025 CineVerse. All rights reserved.</p>
              <p>This is an automated message, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `CineVerse - Your OTP code is: ${otp}. This code is valid for 5 minutes. If you didn't request this, please ignore this message.`
    };

    const response = await sgMail.send(msg);
    console.log(`✅ OTP email sent successfully to ${email}`);
    console.log(`✅ SendGrid Response Status: ${response[0].statusCode}`);
    return { success: true, messageId: response[0].headers['x-message-id'] };
    
  } catch (err) {
    console.error("❌ SendGrid email sending failed:", err.message);
    
    if (err.response) {
      console.error("❌ SendGrid Error Body:", err.response.body);
    }
    
    console.warn("⚠️ Email sending failed! Showing OTP in console as fallback.");
    console.log(`📩 Fallback OTP for ${email}: ${otp}`);
    
    return { success: false, error: err.message, fallbackOtp: otp };
  }
};

/**
 * Send Support Ticket Email using SendGrid
 * @param {string} email - Recipient email
 * @param {string} ticketId - Ticket ID
 * @param {string} subject - Ticket subject
 * @param {string} message - Ticket message
 */
const sendSupportTicketEmail = async (email, ticketId, subject, message) => {
  try {
    console.log(`📧 Sending support ticket confirmation to: ${email}`);

    const msg = {
      to: email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'support@cineverse.com',
        name: 'CineVerse Support'
      },
      subject: `Support Ticket #${ticketId} - ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { text-align: center; color: #16a34a; margin-bottom: 30px; }
            .ticket-info { background: #f9fafb; border-left: 4px solid #16a34a; padding: 15px; margin: 20px 0; }
            .info { color: #666; font-size: 14px; line-height: 1.6; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🆘 Support Ticket Received</h1>
            </div>
            
            <div class="info">
              <p>Hello,</p>
              <p>We've received your support request. Our team will review it and get back to you as soon as possible.</p>
            </div>
            
            <div class="ticket-info">
              <p><strong>Ticket ID:</strong> #${ticketId}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong></p>
              <p>${message}</p>
            </div>
            
            <div class="info">
              <p>You can track your ticket status in your account dashboard.</p>
              <p>Our support team typically responds within 24-48 hours.</p>
            </div>
            
            <div class="footer">
              <p>© 2025 CineVerse. All rights reserved.</p>
              <p>Need immediate help? Visit our Help Center</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `CineVerse Support - Your ticket #${ticketId} has been received. Subject: ${subject}. Message: ${message}. We'll respond within 24-48 hours.`
    };

    const response = await sgMail.send(msg);
    console.log(`✅ Support ticket email sent to ${email}`);
    return { success: true, messageId: response[0].headers['x-message-id'] };
    
  } catch (err) {
    console.error("❌ Support ticket email failed:", err.message);
    return { success: false, error: err.message };
  }
};

module.exports = {
  sendOtpEmail,
  sendSupportTicketEmail
};
