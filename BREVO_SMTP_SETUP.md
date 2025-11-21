## 🔐 How to Get Brevo SMTP Credentials

### Method 1: SMTP Key (Recommended)
1. Login to Brevo: https://app.brevo.com
2. Navigate to: **Settings** → **SMTP & API** → **SMTP Keys**
3. Click **"Generate a new SMTP key"**
4. Copy the generated key
5. Update `.env`:
   ```
   BREVO_SMTP_KEY=your_new_smtp_key
   ```

### Method 2: Use Account Password
1. Use your Brevo login email: `sujeetsharmadc56@gmail.com`
2. Use your Brevo account password (the password you use to login to Brevo)
3. Update `.env`:
   ```
   BREVO_EMAIL=sujeetsharmadc56@gmail.com
   BREVO_SMTP_KEY=your_brevo_account_password
   ```

### How to Verify:
After updating `.env`, restart the server:
```bash
node server.js
```

You should see:
```
✅ Brevo SMTP Server ready to send emails
```

### SMTP Configuration Details:
- **Host:** smtp-relay.brevo.com
- **Port:** 587
- **Security:** STARTTLS (secure: false)
- **User:** Your Brevo login email
- **Password:** SMTP key OR your account password

### Troubleshooting:
If you still get authentication errors:
1. Make sure email is verified in Brevo
2. Check if SMTP is enabled in your Brevo account
3. Try generating a fresh SMTP key
4. Ensure no spaces in the key when pasting to .env

### Test Email Sending:
Once configured, test with:
```bash
POST http://localhost:8000/api/otp/send-otp
{
  "email": "test@example.com",
  "purpose": "registration"
}
```
