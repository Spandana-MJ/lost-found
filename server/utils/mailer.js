const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendMail(to, subject, text) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Lost & Found <onboarding@resend.dev>", 
      to,
      subject,
      html: `<p>${text}</p>`,
    });

    if (error) {
      console.error("❌ Resend error:", error);
      throw new Error(error.message);
    }

    console.log("✅ Email sent:", data.id);
    return data;
  } catch (err) {
    console.error("❌ Failed to send email:", err.message);
    throw err;
  }
}

module.exports = sendMail;