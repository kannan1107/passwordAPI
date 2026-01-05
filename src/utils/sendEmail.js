import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, link }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Password Reset",
    html: `<p>Click to reset password:</p><a href="${link}">${link}</a>`,
  };

  return await transporter.sendMail(mailOptions);
};

export default sendEmail;
