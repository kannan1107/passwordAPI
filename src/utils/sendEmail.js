import SibApiV3Sdk from 'sib-api-v3-sdk';

const sendEmail = async ({ to, subject, text, link }) => {
  try {
    // Strip whitespace and accidental literal quotes
    const apiKey = process.env.BREVO_API_KEY?.trim().replace(/^["']|["']$/g, '');
    const senderEmail = process.env.EMAIL_SENDER?.trim();
    const senderName = process.env.EMAIL_SENDER_NAME?.trim() || "App";

    if (!apiKey) throw new Error("BREVO_API_KEY is not defined in environment variables.");
    if (!senderEmail) throw new Error("EMAIL_SENDER is not defined in environment variables.");

    console.log(`[Brevo Debug] Using Key: ${apiKey.substring(0, 12)}... (Length: ${apiKey.length})`);

    if (!apiKey.startsWith("xkeysib-")) {
      throw new Error("Invalid BREVO_API_KEY format. Ensure you are using a v3 API Key.");
    }

    // Initialize the SDK Client
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    defaultClient.authentications['api-key'].apiKey = apiKey;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    const htmlContent = link
      ? `<div style="font-family:Arial,sans-serif;padding:20px">
          <h2>Password Reset Request</h2>
          <p>Click the button below to reset your password:</p>
          <a href="${link}" style="background:#007bff;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px">Reset Password</a>
          <p style="margin-top:20px">Or copy this link: ${link}</p>
        </div>`
      : `<div style="font-family:Arial,sans-serif;padding:20px">${text.replace(/\n/g, "<br>")}</div>`;

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = { name: senderName, email: senderEmail };
    sendSmtpEmail.to = [{ email: to }];

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    console.log("✅ Email sent via Brevo", data.messageId);
    return data;
  } catch (error) {
    // SDK error responses are nested in error.response.text
    const errorDetail = error.response?.text || error.message;
    console.error("❌ Email failed:", errorDetail);
    throw new Error(errorDetail);
  }
};

export default sendEmail;
