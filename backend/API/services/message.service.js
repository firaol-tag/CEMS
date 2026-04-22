const connectDb = require('../../config/db');

module.exports = {
  getMessageRecords: (query, callback) => {
    const conditions = [];
    const params = [];
    if (query.status) {
      conditions.push('status = ?');
      params.push(query.status);
    }
    if (query.channel) {
      conditions.push('channel = ?');
      params.push(query.channel);
    }
    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    connectDb.query(`SELECT * FROM message_queue ${whereClause} ORDER BY created_at DESC`, params, (err, results) => {
      if (err) return callback(err);
      return callback(null, results);
    });
  },
  getMessageRecordById: (id, callback) => {
    connectDb.query('SELECT * FROM message_queue WHERE id = ?', [id], (err, results) => {
      if (err) return callback(err);
      if (!results.length) {
        const error = new Error('Message not found');
        error.status = 404;
        return callback(error);
      }
      return callback(null, results[0]);
    });
  },
};
