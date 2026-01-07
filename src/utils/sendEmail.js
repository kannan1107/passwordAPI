import SibApiV3Sdk from 'sib-api-v3-sdk';

const sendEmail = async ({ to, subject, text, link }) => {
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  let htmlContent;
  if (link) {
    htmlContent = `<p>Click to reset password:</p><a href="${link}">${link}</a>`;
  } else {
    htmlContent = `<p>${text.replace(/\n/g, '<br>')}</p>`;
  }

  const sendSmtpEmail = {
    to: [{ email: to }],
    sender: { email: process.env.BREVO_SENDER_EMAIL, name: process.env.BREVO_SENDER_NAME || 'Password Manager' },
    subject: subject,
    htmlContent: htmlContent
  };

  return await apiInstance.sendTransacEmail(sendSmtpEmail);
};

export default sendEmail;