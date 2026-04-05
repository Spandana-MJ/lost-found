
// utils/sendTestEmail.js
require("dotenv").config();
const sendMail = require("./mailer"); // make sure mailer.js is in utils/

(async () => {
  console.log("🚀 Sending test email...");

  try {
    await sendMail(
      "your-real-email@gmail.com", // replace with your own
      "Test Email",
      "This is a test email from Lost & Found project."
    );
    console.log("✅ Email send function executed successfully");
  } catch (err) {
    console.error("❌ Failed to send email:", err);
  }
})();
