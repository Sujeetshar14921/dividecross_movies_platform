const nodemailer = require("nodemailer");
require("dotenv").config();

async function testEmail() {
  console.log("🔍 Testing Email Configuration...\n");
  
  console.log("📧 Email Config:");
  console.log("   BREVO_EMAIL:", process.env.BREVO_EMAIL);
  console.log("   BREVO_SMTP_KEY:", process.env.BREVO_SMTP_KEY ? "✅ Set" : "❌ Not Set");
  console.log();

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_EMAIL,
        pass: process.env.BREVO_SMTP_KEY,
      },
    });

    console.log("🔗 Testing SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP Connection Successful!\n");

    // Send test email
    const testOtp = "123456";
    const testEmail = "sujeetsharmadc56@gmail.com"; // Change to your email

    console.log(`📨 Sending test OTP email to: ${testEmail}`);
    
    const mailOptions = {
      from: `"CineVerse Test" <${process.env.BREVO_EMAIL}>`,
      to: testEmail,
      subject: "Test OTP - CineVerse",
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
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎬 CineVerse</h1>
              <p>Test Email - OTP Verification</p>
            </div>
            <div class="otp-box">
              <p style="margin: 0; font-size: 16px;">Your Test OTP Code</p>
              <div class="otp-code">${testOtp}</div>
              <p style="margin: 0; font-size: 14px;">Valid for 5 minutes</p>
            </div>
            <div style="color: #666; padding: 20px 0;">
              <p>This is a test email to verify email delivery is working.</p>
              <p>If you received this, OTP emails are working correctly! ✅</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `CineVerse Test - Your test OTP code is: ${testOtp}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email Sent Successfully!");
    console.log("📬 Message ID:", info.messageId);
    console.log("📮 Response:", info.response);
    console.log("\n✨ Check your inbox (and spam folder)!");
    
  } catch (error) {
    console.error("❌ Email Test Failed:");
    console.error("   Error:", error.message);
    console.error("   Full Error:", error);
  }
}

testEmail();
