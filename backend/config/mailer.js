const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

async function sendEmail({ to, subject, html }) {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error('SendGrid API key is not configured');
  }

  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL || 'no-reply@cems.local',
    subject,
    html,
  };

  return sgMail.send(msg);
}

module.exports = { sendEmail };
