import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendResetEmail(to: string, resetLink: string) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Password Reset Request',
    text: `Click the link to reset your password: ${resetLink}`,
    html: `<p>Click the link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
  });
}
