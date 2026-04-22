const {
  getMessageRecords,
  getMessageRecordById,
} = require('../services/message.service');

module.exports = {
  getMessages: (req, res) => {
    getMessageRecords(req.query, (err, messages) => {
      if (err) {
        return res.status(err.status || 500).json({ message: err.message });
      }
      res.json(messages);
    });
  },
  getMessageById: (req, res) => {
    getMessageRecordById(req.params.id, (err, message) => {
      if (err) {
        return res.status(err.status || 500).json({ message: err.message });
      }
      res.json(message);
    });
  },
};
