const connectDb = require('../config/db');

async function createSegmentRecord(data) {
  const pool = await connectDb();
  const [result] = await pool.execute(
    'INSERT INTO customer_segments (name, filter_json, created_at) VALUES (?, ?, ?)',
    [data.name, JSON.stringify(data.filter_json || {}), new Date()]
  );
  return { id: result.insertId, name: data.name, filter_json: data.filter_json || {} };
}

async function getSegmentRecords() {
  const pool = await connectDb();
  const [rows] = await pool.execute('SELECT * FROM customer_segments ORDER BY created_at DESC');
  return rows.map(row => ({ ...row, filter_json: JSON.parse(row.filter_json || '{}') }));
}

async function getSegmentRecordById(id) {
  const pool = await connectDb();
  const [rows] = await pool.execute('SELECT * FROM customer_segments WHERE id = ?', [id]);
  if (!rows.length) {
    const err = new Error('Segment not found');
    err.status = 404;
    throw err;
  }
  const row = rows[0];
  return { ...row, filter_json: JSON.parse(row.filter_json || '{}') };
}

async function updateSegmentRecord(id, data) {
  const pool = await connectDb();
  const [rows] = await pool.execute('SELECT * FROM customer_segments WHERE id = ?', [id]);
  if (!rows.length) {
    const err = new Error('Segment not found');
    err.status = 404;
    throw err;
  }
  const changes = [];
  const params = [];
  if (data.name !== undefined) {
    changes.push('name = ?');
    params.push(data.name);
  }
  if (data.filter_json !== undefined) {
    changes.push('filter_json = ?');
    params.push(JSON.stringify(data.filter_json));
  }
  if (!changes.length) return getSegmentRecordById(id);
  params.push(id);
  await pool.execute(`UPDATE customer_segments SET ${changes.join(', ')} WHERE id = ?`, params);
  return getSegmentRecordById(id);
}

async function deleteSegmentRecord(id) {
  const pool = await connectDb();
  await pool.execute('DELETE FROM customer_segments WHERE id = ?', [id]);
}

module.exports = {
  createSegmentRecord,
  getSegmentRecords,
  getSegmentRecordById,
  updateSegmentRecord,
  deleteSegmentRecord,
};
