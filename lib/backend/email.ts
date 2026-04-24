import "server-only";

import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST || "smtp.gmail.com";
const port = Number(process.env.SMTP_PORT || 465);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.SMTP_FROM || user;

export const sendOtpEmail = async (email: string, otp: string) => {
  if (!user || !pass || !from) {
    throw new Error("SMTP_USER, SMTP_PASS, and SMTP_FROM are required.");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  await transporter.sendMail({
    from,
    to: email,
    subject: "Your Filyn verification code",
    text: `Your Filyn verification code is ${otp}. It expires in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2 style="margin: 0 0 16px;">Filyn verification code</h2>
        <p style="margin: 0 0 12px;">Use this code to continue signing in:</p>
        <div style="font-size: 28px; font-weight: 700; letter-spacing: 4px; margin: 12px 0 18px;">
          ${otp}
        </div>
        <p style="margin: 0; color: #6b7280;">This code expires in 10 minutes.</p>
      </div>
    `,
  });
};
