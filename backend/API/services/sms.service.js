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
  const apiKey = process.env.AFROMESSAGE_API_KEY;
  const senderId = process.env.AFROMESSAGE_SENDER_ID;
  const identifierId = process.env.AFROMESSAGE_IDENTIFIER_ID; // Optional
  
  if (!apiKey) {
    throw new Error('AfroMessage API key is not configured');
  }

  if (!to) {
    throw new Error('Recipient phone number is required for SMS');
  }

  if (!message) {
    throw new Error('SMS message content is required');
  }
  
  const phoneNumber = normalizePhoneNumber(to);
  const payload = {
    to: phoneNumber,
    message: message,
    sender: senderId
  };

  // Add optional parameters if available
  if (identifierId) {
    payload.from = identifierId;
  }

  console.log('Prepared SMS payload:', payload);

  if (custom_id) {
    payload.callback = custom_id; // Use callback for custom_id if provided
  }
  
  try {
    const response = await axios.post('https://api.afromessage.com/api/send', payload, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
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