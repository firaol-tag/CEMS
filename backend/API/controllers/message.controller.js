const {
  getMessageRecords,
  getMessageRecordById,
} = require('../services/message.service');

async function getMessages(req, res) {
  const messages = await getMessageRecords(req.query);
  res.json(messages);
}

async function getMessageById(req, res) {
  const message = await getMessageRecordById(req.params.id);
  res.json(message);
}

module.exports = { getMessages, getMessageById };
