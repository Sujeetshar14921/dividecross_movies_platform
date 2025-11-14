# 📧 SendGrid Email Setup for CineVerse

## Why SendGrid Instead of Gmail SMTP?

**Problem:** Render (and many hosting platforms) **block SMTP ports (587/465)** on free tier, causing connection timeouts when trying to send emails via Gmail SMTP.

**Solution:** Use **SendGrid API** which works over HTTP/HTTPS (port 443) - never blocked by hosting providers.

---

## 🚀 Setup Instructions

### Step 1: Create Free SendGrid Account

1. Go to: https://signup.sendgrid.com/
2. Sign up with your email
3. Verify your email address
4. Complete the setup wizard

**Free Tier Limits:** 100 emails/day (perfect for OTP verification)

---

### Step 2: Get SendGrid API Key

1. Login to SendGrid Dashboard: https://app.sendgrid.com/
2. Go to **Settings** → **API Keys** (left sidebar)
3. Click **Create API Key**
4. Name: `CineVerse Production`
5. API Key Permissions: **Full Access** (or Restricted with Mail Send permission)
6. Click **Create & View**
7. **COPY THE API KEY** (you won't see it again!)

Example API Key format: `SG.xxxxxxxxxxxxxxxxxxxxxxxx.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy`

---

### Step 3: Verify Sender Identity

**Important:** SendGrid requires sender verification to send emails.

#### Option A: Single Sender Verification (Recommended for getting started)

1. Go to **Settings** → **Sender Authentication**
2. Click **Get Started** under "Single Sender Verification"
3. Fill in your details:
   - **From Name:** CineVerse
   - **From Email:** Your email (e.g., `sujeetsharmadc56@gmail.com`)
   - **Reply To:** Same email
   - **Company:** CineVerse
4. Click **Create**
5. **Check your email** and click verification link
6. Once verified, you can send emails from this address

#### Option B: Domain Authentication (For custom domains)

1. If you have a custom domain (e.g., `cineverse.com`)
2. Go to **Settings** → **Sender Authentication** → **Domain Authentication**
3. Follow DNS setup instructions
4. This allows sending from `noreply@cineverse.com` or any `@cineverse.com` email

---

### Step 4: Configure Environment Variables in Render

1. Go to Render Dashboard: https://dashboard.render.com/
2. Select your `dividecross-backend` service
3. Go to **Environment** tab
4. Add these environment variables:

```env
SENDGRID_API_KEY=SG.your-actual-api-key-here
SENDGRID_FROM_EMAIL=sujeetsharmadc56@gmail.com
```

**Important:** Replace with:
- Your actual SendGrid API key from Step 2
- Your verified sender email from Step 3

5. Click **Save Changes**
6. Render will auto-redeploy

---

### Step 5: Test Email Sending

After deployment completes:

1. Go to your frontend: https://dividecross-movies-platform-na3z.vercel.app/register
2. Register a new user with a real email address
3. Check Render logs for:
   ```
   📧 Attempting to send email to: test@example.com
   📧 Using SendGrid API
   ✅ OTP email sent successfully to test@example.com
   ✅ SendGrid Response Status: 202
   ```
4. Check your email inbox (also spam/junk folder)
5. You should receive a beautiful HTML OTP email!

---

## 🔧 Local Development Setup

For testing on your local machine:

1. Add to `backend/.env`:
```env
SENDGRID_API_KEY=SG.your-actual-api-key-here
SENDGRID_FROM_EMAIL=sujeetsharmadc56@gmail.com
```

2. Restart backend server:
```bash
cd backend
npm run dev
```

---

## 📊 Monitoring Email Delivery

### Check SendGrid Dashboard

1. Go to: https://app.sendgrid.com/
2. Click **Activity** in left sidebar
3. View all sent emails with delivery status
4. See bounces, opens, clicks, etc.

### Check Render Logs

1. Go to Render Dashboard → Your Service → Logs
2. Look for email sending logs:
   - `✅` = Email sent successfully
   - `❌` = Email failed with error details
   - `📩 Fallback OTP` = Email failed, OTP shown in logs for testing

---

## 🎨 Email Templates

The new email service includes beautiful HTML templates:

### OTP Email Features:
- ✅ Professional HTML design
- ✅ Responsive for mobile/desktop
- ✅ Large, clear OTP code display
- ✅ 5-minute expiration notice
- ✅ Security warning
- ✅ Branded with CineVerse logo

### Support Ticket Email Features:
- ✅ Ticket confirmation
- ✅ Ticket ID display
- ✅ Message summary
- ✅ Response time expectation

---

## 🐛 Troubleshooting

### Error: "Invalid API Key"
- **Fix:** Check SENDGRID_API_KEY in Render environment variables
- Ensure no extra spaces or quotes
- API key should start with `SG.`

### Error: "Sender not verified"
- **Fix:** Complete Single Sender Verification in SendGrid
- Check email for verification link
- Wait 5-10 minutes after verification

### Error: "Free account exceeded daily limit"
- **Fix:** SendGrid free tier = 100 emails/day
- Upgrade to paid plan OR wait 24 hours for reset
- Monitor usage in SendGrid Dashboard → Activity

### Emails in Spam Folder
- **Fix:** Complete Domain Authentication (Step 3, Option B)
- Add SPF, DKIM, DMARC records to your domain
- SendGrid provides exact DNS records to add

### Still showing "Fallback OTP" in logs
- **Fix:** Check Render logs for exact error message
- Verify SENDGRID_API_KEY is set correctly
- Test API key in SendGrid Dashboard → API Keys → Test

---

## 📈 Upgrade Options

### SendGrid Pricing:

| Plan | Price | Emails/Day | Features |
|------|-------|------------|----------|
| **Free** | $0 | 100 | Basic sending |
| **Essentials** | $15/mo | 50,000 | Email validation, 3-day support |
| **Pro** | $89/mo | 1.5M | Advanced features, dedicated IP |

For production with many users, consider Essentials plan.

---

## 🔐 Security Best Practices

1. **Never commit API keys to Git**
   - Always use environment variables
   - Add `.env` to `.gitignore`

2. **Use Restricted API Keys**
   - In SendGrid Dashboard, create keys with only "Mail Send" permission
   - Don't use Full Access keys in production

3. **Rotate API Keys Regularly**
   - Create new key every 90 days
   - Delete old keys immediately

4. **Monitor Activity**
   - Check SendGrid Activity dashboard weekly
   - Set up alerts for failed sends

---

## 📝 Summary

✅ **SendGrid installed:** `@sendgrid/mail` package added  
✅ **Email service created:** `backend/services/emailService.js`  
✅ **Controllers updated:** Using SendGrid instead of nodemailer  
✅ **Beautiful templates:** Professional HTML email designs  

**Next Steps:**
1. Get SendGrid API key
2. Verify sender email
3. Add to Render environment variables
4. Test registration flow
5. Check email inbox!

---

## 📞 Need Help?

- **SendGrid Docs:** https://docs.sendgrid.com/
- **Support:** https://support.sendgrid.com/
- **API Status:** https://status.sendgrid.com/

**Your fallback OTP is still shown in Render logs for testing even if email fails!**

---

**Made with ❤️ for CineVerse Platform**
