const axios = require('axios');

async function sendSms({ to, message }) {
  if (!process.env.AT_API_KEY || !process.env.AT_USERNAME) {
    throw new Error('Africa\'s Talking credentials are missing');
  }

  const payload = new URLSearchParams({
    username: process.env.AT_USERNAME,
    to,
    message,
    from: process.env.AT_SENDER || 'CEMS',
  });

  const response = await axios.post(
    'https://api.africastalking.com/version1/messaging',
    payload.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        apikey: process.env.AT_API_KEY,
      },
    }
  );
  return response.data;
}

module.exports = { sendSms };
