const axios = require('axios');

function normalizePhoneNumber(phone) {
  if (!phone) return null;
  let normalized = String(phone).trim().replace(/[\s()-]/g, '');
  if (!normalized) return null;
  if (normalized.startsWith('+')) {
    return normalized;
  }
  if (normalized.startsWith('09') && normalized.length === 10) {
    return '+251' + normalized.substring(1);
  }
  if (normalized.startsWith('251') && normalized.length === 12) {
    return '+' + normalized;
  }
  return '+' + normalized;
}

async function sendSms({ to, message, custom_id }) {
  const apiKey = process.env.SIMGATE_API_KEY;

  if (!apiKey) {
    throw new Error('SimGate API key is not configured');
  }

  if (!to) {
    throw new Error('Recipient phone number is required for SMS');
  }

  if (!message) {
    throw new Error('SMS message content is required');
  }

  const phoneNumber = normalizePhoneNumber(to);
  const payload = {
    phoneNumber,
    message,
  };

  if (process.env.SIMGATE_DEVICE_ID) {
    payload.deviceId = process.env.SIMGATE_DEVICE_ID;
  }

  if (custom_id) {
    payload.custom_id = custom_id;
  }

  try {
    const response = await axios.post('https://api.simgate.app/v1/sms/send', payload, {
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });

    console.log('SMS response:', response.data);
    return response.data;
  } catch (error) {
    console.error('SMS send error:', error.response ? error.response.data : error.message);
    throw new Error(`Failed to send SMS: ${error.response ? (error.response.data.message || JSON.stringify(error.response.data)) : error.message}`);
  }
}

module.exports = { sendSms };