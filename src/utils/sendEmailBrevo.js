import SibApiV3Sdk from "sib-api-v3-sdk";

const sendEmailBrevo = async ({ to, subject, text, link }) => {
  try {
    console.log(
      "🔍 Brevo API Key check:",
      process.env.BREVO_API_KEY ? "Present" : "Missing",
    );

    if (!process.env.BREVO_API_KEY) {
      throw new Error("BREVO_API_KEY not set");
    }

    const client = SibApiV3Sdk.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    let htmlContent;
    if (link) {
      htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>Click the button below to reset your password:</p>
          <a href="${link}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p>Or copy this link: ${link}</p>
          <p>This link will expire in 1 hour.</p>
        </div>
      `;
    } else {
      htmlContent = `<div style="font-family: Arial, sans-serif; padding: 20px;"><p>${text.replace(/\n/g, "<br>")}</p></div>`;
    }

    const sendSmtpEmail = {
      to: [{ email: to }],
      sender: {
        email: "kannanmarimuthu1107@gmail.com",
        name: "Password Manager",
      },
      subject: subject,
      htmlContent: htmlContent,
    };

    console.log("📧 Sending email via Brevo to:", to);
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email sent via Brevo", result.messageId);
    return result;
  } catch (error) {
    console.error("❌ Brevo detailed error:", {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      body: error.body,
      response: error.response,
    });
    throw new Error(`Brevo API Error: ${error.message}`);
  }
};

export default sendEmailBrevo;
