import nodemailer from "nodemailer";

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_MAIL_HOST,
    port: parseInt(process.env.SMTP_MAIL_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_MAIL_USER,
      pass: process.env.SMTP_MAIL_PASSWORD,
    },
  });
}

export function sendMail(subject: string, text: string) {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.SMTP_MAIL_USER,
    to: process.env.SMTP_MAIL_SEND_NOTIFICATIONS_TO,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
}
