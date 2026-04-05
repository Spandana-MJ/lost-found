
const nodemailer = require("nodemailer");

// ── Create transporter ────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});

// ── Verify connection on startup ──────────────────────────────
transporter.verify((err, success) => {
  if (err) {
    console.error("❌ Email transporter failed to connect:", err.message);
    console.error("   Check EMAIL_USER and EMAIL_PASS in your .env file");
    console.error("   EMAIL_PASS must be a Gmail App Password (16 chars, no spaces)");
  } else {
    console.log("✅ Email transporter ready — connected to Gmail");
  }
});

// ── Send mail helper ──────────────────────────────────────────
async function sendMail(to, subject, text, html) {
  if (!to) {
    console.error("❌ sendMail called with no recipient");
    throw new Error("Recipient email is required");
  }
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ EMAIL_USER or EMAIL_PASS not set in .env");
    throw new Error("Email credentials not configured");
  }

  try {
    const info = await transporter.sendMail({
      from: `"Lost & Found App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: html || `<p>${text}</p>`, 
    });
    console.log(`✅ Email sent to ${to} — MessageId: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`❌ Failed to send email to ${to}:`, err.message);
    throw err; 
  }
}

module.exports = sendMail;
