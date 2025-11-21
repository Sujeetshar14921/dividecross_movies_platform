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

// Send OTP Email using Brevo + Nodemailer
exports.sendOtpEmail = async (email, otp, subject = "Verify Your Email - DivideCross") => {
  try {
    console.log(`Preparing to send OTP to: ${email}`);
    
    const senderEmail = process.env.SENDER_EMAIL || process.env.ADMIN_EMAIL || 'noreply@dividecross.com';
    const mailOptions = {
      from: `"DivideCross Movies" <${senderEmail}>`,
      to: email,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              background-color: #f4f4f4; 
              margin: 0; 
              padding: 20px; 
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background: #ffffff; 
              border-radius: 10px; 
              padding: 30px; 
              box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
            }
            .header { 
              text-align: center; 
              color: #dc2626; 
              margin-bottom: 30px; 
            }
            .header h1 { 
              margin: 0; 
              font-size: 28px; 
            }
            .otp-box { 
              background: linear-gradient(135deg, #dc2626, #ec4899); 
              color: white; 
              padding: 20px; 
              border-radius: 8px; 
              text-align: center; 
              margin: 20px 0; 
            }
            .otp-code { 
              font-size: 36px; 
              font-weight: bold; 
              letter-spacing: 8px; 
              margin: 10px 0; 
            }
            .info { 
              color: #666; 
              font-size: 14px; 
              line-height: 1.6; 
            }
            .footer { 
              text-align: center; 
              color: #999; 
              font-size: 12px; 
              margin-top: 30px; 
              padding-top: 20px; 
              border-top: 1px solid #eee; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>DivideCross</h1>
              <p>Your Movie Streaming Platform</p>
            </div>
            
            <div class="otp-box">
              <p style="margin: 0; font-size: 16px;">Your OTP Code</p>
              <div class="otp-code">${otp}</div>
              <p style="margin: 0; font-size: 14px;">Valid for 5 minutes</p>
            </div>
            
            <div class="info">
              <p>Hello,</p>
              <p>You've requested to verify your account on DivideCross. Please use the OTP code above to complete your verification.</p>
              <p><strong>Important:</strong> This code will expire in 5 minutes. Do not share this code with anyone.</p>
              <p>If you didn't request this code, please ignore this email.</p>
            </div>
            
            <div class="footer">
              <p>© 2025 DivideCross. All rights reserved.</p>
              <p>This is an automated message, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `DivideCross - Your OTP code is: ${otp}. This code is valid for 5 minutes. If you didn't request this, please ignore this message.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully! Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Email send error: ${error.message}`);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};
