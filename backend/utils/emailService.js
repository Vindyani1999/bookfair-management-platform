const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendOtpEmail(to, otp) {
  const html = `
    <p>Your password reset code is: <strong>${otp}</strong></p>
    <p>This code will expire in ${Math.floor((process.env.OTP_TTL_SECONDS || 300) / 60)} minutes.</p>
  `;

  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL, 
    subject: 'Password Reset Code',
    text: `Your password reset code is: ${otp}`,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log(`OTP email sent to ${to}`);
  } catch (error) {
    console.error('SendGrid error:', error.response ? error.response.body : error);
    throw new Error('Failed to send OTP email');
  }
}

async function sendReservationEmail(to, data) {
  const html = `
    <h2>Reservation Confirmed</h2>
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
    <br><br>
    <p>Thank you for booking with us!</p>
  `;

  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: 'Reservation Successful',
    html,
  };

  try {
    await sgMail.send(msg);
    console.log(`Reservation email sent to ${to}`);
  } catch (error) {
    console.error('SendGrid error:', error.response ? error.response.body : error);
    throw new Error('Failed to send reservation email');
  }
}

module.exports = { sendOtpEmail, sendReservationEmail };


