const sendEmail = async ({ to, subject, text, link }) => {
  try {
    const htmlContent = link
      ? `<div style="font-family:Arial,sans-serif;padding:20px">
          <h2>Password Reset Request</h2>
          <p>Click the button below to reset your password:</p>
          <a href="${link}" style="background:#007bff;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px">Reset Password</a>
          <p>Or copy this link: ${link}</p>
          <p>This link will expire in 1 hour.</p>
        </div>`
      : `<div style="font-family:Arial,sans-serif;padding:20px"><p>${text.replace(/\n/g, "<br>")}</p></div>`;

    const res = await fetch("https://api.brevo.com/v3/emailCampaigns/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: process.env.EMAIL_SENDER_NAME, email: process.env.EMAIL_SENDER },
        to: [{ email: to }],
        subject,
        htmlContent,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));

    console.log("✅ Email sent via Brevo", data.messageId);
    return data;
  } catch (error) {
    console.error("❌ Email failed:", error.message);
    throw error;
  }
};

export default sendEmail;
