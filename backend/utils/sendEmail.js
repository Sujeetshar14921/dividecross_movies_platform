const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // For development/production compatibility
      },
      connectionTimeout: 10000, // 10 seconds timeout
      greetingTimeout: 5000,
      socketTimeout: 15000,
    });

    await transporter.sendMail({
      from: `"CineVerse" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      text: message,
    });
    console.log(`✅ Email sent to ${email}`);
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
  }
};

module.exports = sendEmail;
