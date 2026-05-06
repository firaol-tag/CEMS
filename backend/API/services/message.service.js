const { query } = require('../../config/db');

module.exports = {
  getMessageRecords: async (queryParams) => {
    const conditions = [];
    const params = [];
    if (queryParams.status) {
      conditions.push('status = ?');
      params.push(queryParams.status);
    }
    if (queryParams.channel) {
      conditions.push('channel = ?');
      params.push(queryParams.channel);
    }
    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const results = await query(`SELECT * FROM message_queue ${whereClause} ORDER BY created_at DESC`, params);
    return results;
  },
  getMessageRecordById: async (id) => {
    const results = await query('SELECT * FROM message_queue WHERE id = ?', [id]);
    if (!results.length) {
      const error = new Error('Message not found');
      error.status = 404;
      throw error;
    }
    return results[0];
  },
};
