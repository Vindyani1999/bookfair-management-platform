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

async function sendResevationEmail(to, data) {
  const html =  `
        <h2>Reservation Confirmed </h2>
        <p>Dear ${data.userName},</p>
        <p>Your reservation has been successfully confirmed and payment received.</p>
        <ul>
          <li><b>User ID:</b> ${data.userId}</li>
          <li><b>Hall Name:</b> ${data.hallName}</li>
          <li><b>Stall(s):</b> ${data.stallNames}</li>
          <li><b>Booking Date:</b> ${new Date(data.bookingDate).toLocaleString()}</li>
          <li><b>Payment:</b> Paid</li>
        </ul>
        <p>Please find your QR code below. Show it upon arrival for verification.</p>
        <img src="cid:qrcode" alt="QR Code" style="width:200px;height:200px;" />
        <br><br>
        <p>Thank you for booking with us!</p>
      `;
  return transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: 'Reservation successful',
    text: 'Your reservation placed successful',
    html,
    attachments: [
      {
        filename: 'qrcode.png',
        content: data.qrCodeDataURL.split('base64,')[1],
        encoding: 'base64',
        cid: 'qrcode' // same as used in <img src="cid:qrcode" />
      }
    ]
  });
}
module.exports = { sendOtpEmail, sendResevationEmail };
