const nodemailer = require('nodemailer');

async function verifyEmailConfig() {
  if (!process.env.BREVO_EMAIL || !process.env.BREVO_SMTP_KEY) {
    console.log('Brevo email configuration not found - Email features will be disabled');
    console.log('Add BREVO_EMAIL and BREVO_SMTP_KEY to .env to enable emails');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_EMAIL,
        pass: process.env.BREVO_SMTP_KEY
      },
      connectionTimeout: 10000,
    });

    await transporter.verify();
    console.log('Brevo SMTP Server ready to send emails');
  } catch (error) {
    console.log('Brevo SMTP verification failed:', error.message);
    console.log('To fix:');
    console.log('   1. Get SMTP key from: https://app.brevo.com/settings/keys/smtp');
    console.log('   2. Update BREVO_SMTP_KEY in .env file');
    console.log('   3. OR use your Brevo account password as BREVO_SMTP_KEY');
  }
}

module.exports = { verifyEmailConfig };

