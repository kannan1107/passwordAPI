import dotenv from "dotenv";
import  SibApiV3Sdk from "sib-api-v3-sdk";


dotenv.config();

// send mail useng on  brevo API Keys 

 const sendMail = async (to, subject, text, html) => {
  if (!process.env.BREVO_API_KEY) {
    throw new Error("Missing BREVO_API_KEY in environment configuration");
  }

  if (!process.env.EMAIL_SENDER) {
    throw new Error("Missing EMAIL_SENDER in environment configuration");
  }

  try {
    const client = SibApiV3Sdk.ApiClient.instance;
    client.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

    const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

    const emailData = {
      sender: {
        name: process.env.EMAIL_SENDER_NAME || "Your App Name", // Make sender name configurable
        email: process.env.EMAIL_SENDER,
      },
      to: [
        {
          email: to,
        },
      ],
      subject: subject,
      textContent: text,
      ...(html ? { htmlContent: html } : {}),
    };

    await tranEmailApi.sendTransacEmail(emailData);
    console.log("Email sent successfully via Brevo");
  } catch (error) {
    const providerMessage =
      error?.response?.body?.message || error?.message || "Unknown email error";

    console.error("Error sending email:", providerMessage);

    if (providerMessage.includes("unrecognised IP address")) {
      throw new Error(
        "Brevo blocked this request because the server IP is not authorized. Add the current public IP to Brevo authorized IPs."
      );
    }

    throw new Error(providerMessage);
  }
};

export default sendMail;
