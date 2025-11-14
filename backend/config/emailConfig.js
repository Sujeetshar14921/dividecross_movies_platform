const nodemailer = require('nodemailer');

async function verifyEmailConfig() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('⚠️ Email configuration not found - Email features will be disabled');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000,
    });

    await transporter.verify();
    console.log('✅ SMTP Server ready to send emails via port', process.env.EMAIL_PORT || 587);
  } catch (error) {
    console.log('⚠️ SMTP verification failed (emails may be delayed):', error.message);
    console.log('💡 Emails will still be attempted when needed');
  }
}

module.exports = { verifyEmailConfig };
