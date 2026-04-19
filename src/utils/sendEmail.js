import SibApiV3Sdk from 'sib-api-v3-sdk';

/**
 * Sends a transactional email using the Brevo SDK.
 * @param {Object} params
 * @param {string} params.to - Recipient email.
 * @param {string} params.subject - Email subject line.
 * @param {string} [params.text] - Plain text content.
 * @param {string} [params.link] - Optional reset link.
 */
const sendEmail = async ({ to, subject, text, link }) => {
  try {
    // Strip whitespace and accidental literal quotes
    const apiKeyString = process.env.BREVO_API_KEY?.trim().replace(/^["']|["']$/g, '');
    const senderEmail = process.env.EMAIL_SENDER?.trim();
    const senderName = process.env.EMAIL_SENDER_NAME?.trim() || "Password Manager";
    
    if (!apiKeyString) throw new Error("BREVO_API_KEY is missing.");
    if (!senderEmail) throw new Error("EMAIL_SENDER is missing.");

    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    defaultClient.authentications['api-key'].apiKey = apiKeyString;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    const htmlContent = link
      ? `<div style="font-family:Arial,sans-serif;padding:20px">
          <h2>Password Reset Request</h2>
          <p>Click the button below to reset your password:</p>
          <a href="${link}" style="background:#007bff;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;display:inline-block;">Reset Password</a>
          <p style="margin-top:20px">Or copy this link: ${link}</p>
        </div>`
      : `<div style="font-family:Arial,sans-serif;padding:20px">${(text || '').replace(/\n/g, "<br>")}</div>`;

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = { name: senderName, email: senderEmail };
    sendSmtpEmail.to = [{ email: to }];

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    console.log("✅ Email sent via Brevo:", data.messageId);
    return data;
  } catch (error) {
    const errorMessage = error.response?.text || error.message;
    console.error("❌ Email failed:", errorMessage);
    throw new Error(errorMessage);
  }
};

export default sendEmail;
