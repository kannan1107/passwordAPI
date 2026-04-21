import SibApiV3Sdk from "sib-api-v3-sdk";

import dotenv from "dotenv";

dotenv.config();

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const tranEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmail = async ({ to, subject, text, link }) => {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = `<div style="font-family:Arial,sans-serif;padding:20px">
    <h2>Password Reset Request</h2>
    <p>Click the button below to reset your password:</p>
    <a href="${link}" style="background:#007bff;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;display:inline-block;">Reset Password</a>
    <p style="margin-top:20px">Or copy this link: ${link}</p>
  </div>`;
  sendSmtpEmail.sender = { name: "Password Manager", email: process.env.EMAIL_SENDER };
  sendSmtpEmail.to = [{ email: to }];

  try {
    const data = await tranEmailsApi.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent via Brevo:", data);
    return data;
  } catch (error) {
    console.error("Error sending email via Brevo:", error.response?.body || error.message);
    throw new Error(error.response?.body || error.message);
  }
};

export default sendEmail;

/// Usage example:
// sendEmail({
//   to: "user@example.com",
//   subject: "Password Reset",
//   link: "https://example.com/reset-password"
// });  
