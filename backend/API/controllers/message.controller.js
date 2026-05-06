const {
  getMessageRecords,
  getMessageRecordById,
} = require('../services/message.service');

module.exports = {
  getMessages: async (req, res) => {
    try {
      const messages = await getMessageRecords(req.query);
      res.json(messages);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },
  getMessageById: async (req, res) => {
    try {
      const message = await getMessageRecordById(req.params.id);
      res.json(message);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },
};
