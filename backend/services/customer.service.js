const connectDb = require('../config/db');

async function createCustomerRecord(data) {
  const pool = await connectDb();
  const sql = `INSERT INTO customers (name, email, phone, gender, location, last_purchase_date, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const params = [
    data.name,
    data.email,
    data.phone,
    data.gender,
    data.location,
    data.last_purchase_date || null,
    new Date(),
  ];
  const [result] = await pool.execute(sql, params);
  return { id: result.insertId, ...data };
}

async function getCustomerRecords(query) {
  const pool = await connectDb();
  const conditions = [];
  const params = [];

  if (query.location) {
    conditions.push('location = ?');
    params.push(query.location);
  }
  if (query.gender) {
    conditions.push('gender = ?');
    params.push(query.gender);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const [rows] = await pool.execute(`SELECT * FROM customers ${whereClause} ORDER BY created_at DESC`, params);
  return rows;
}

async function getCustomerRecordById(id) {
  const pool = await connectDb();
  const [rows] = await pool.execute('SELECT * FROM customers WHERE id = ?', [id]);
  if (!rows.length) {
    const err = new Error('Customer not found');
    err.status = 404;
    throw err;
  }
  return rows[0];
}

async function updateCustomerRecord(id, data) {
  const pool = await connectDb();
  const fields = [];
  const params = [];
  const allowed = ['name', 'email', 'phone', 'gender', 'location', 'last_purchase_date'];
  for (const key of allowed) {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`);
      params.push(data[key]);
    }
  }
  if (!fields.length) return getCustomerRecordById(id);
  params.push(id);
  await pool.execute(`UPDATE customers SET ${fields.join(', ')} WHERE id = ?`, params);
  return getCustomerRecordById(id);
}

async function deleteCustomerRecord(id) {
  const pool = await connectDb();
  await pool.execute('DELETE FROM customers WHERE id = ?', [id]);
}

module.exports = {
  createCustomerRecord,
  getCustomerRecords,
  getCustomerRecordById,
  updateCustomerRecord,
  deleteCustomerRecord,
};
