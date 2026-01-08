import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text, link }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

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
      htmlContent = `<div style="font-family: Arial, sans-serif; padding: 20px;"><p>${text.replace(
        /\n/g,
        "<br>"
      )}</p></div>`;
    }

    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent,
    });

    console.log("✅ Email sent via Gmail", result.messageId);
    return result;
  } catch (error) {
    console.error("❌ Email failed:", error.message);
    throw error;
  }
};

export default sendEmail;
