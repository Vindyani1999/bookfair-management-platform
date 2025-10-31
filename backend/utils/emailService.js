const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: false, // true for 465, false for others
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendOtpEmail(to, otp) {
  const html = `
    <p>Your password reset code is: <strong>${otp}</strong></p>
    <p>This code will expire in ${Math.floor((process.env.OTP_TTL_SECONDS || 300) / 60)} minutes.</p>
  `;
  return transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: 'Password reset code',
    text: `Your password reset code is: ${otp}`,
    html,
  });
}

module.exports = { sendOtpEmail };
