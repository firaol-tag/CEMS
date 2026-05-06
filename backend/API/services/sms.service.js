const AfricasTalking = require('africastalking');

const africastalking = AfricasTalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
});

const sms = africastalking.SMS;

async function sendSms({ to, message }) {
  if (!process.env.AT_API_KEY || !process.env.AT_USERNAME) {
    throw new Error("Africa's Talking credentials are not configured");
  }

  if (!to) {
    throw new Error('Recipient phone number is required for SMS');
  }

  if (!message) {
    throw new Error('SMS message content is required');
  }

  const payload = {
    to: [to],
    message,
  };

  // optional sender ID
  if (process.env.AT_FROM) {
    payload.from = process.env.AT_FROM;
  }

  const response = await sms.send(payload);
  console.log("SMS response:", response);

  return response;
}

module.exports = { sendSms };