const connectDb = require('../../config/db');

async function getMessageRecords(query) {
  const pool = await connectDb();
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
  const [rows] = await pool.query(`SELECT * FROM message_queue ${whereClause} ORDER BY created_at DESC` , params);
  return rows;
}

async function getMessageRecordById(id) {
  const pool = await connectDb();
  const [rows] = await pool.query('SELECT * FROM message_queue WHERE id = ?', [id]);
  if (!rows.length) {
    const err = new Error('Message not found');
    err.status = 404;
    throw err;
  }
  return rows[0];
}

module.exports = { getMessageRecords, getMessageRecordById };
