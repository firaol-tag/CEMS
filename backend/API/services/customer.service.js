const { query } = require('../../config/db');

function normalizePhoneNumber(phone) {
  if (!phone) return null;
  let normalized = String(phone).trim();
  if (!normalized) return null;
  normalized = normalized.replace(/[\s()-]/g, '');
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

module.exports = {
  createCustomerRecord: async (data) => {
    const phone = normalizePhoneNumber(data.phone);
    const sql = `INSERT INTO customers (name, email, phone, gender, location, last_purchase_date, created_at, customer_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      data.name,
      data.email,
      phone,
      data.gender,
      data.location,
      data.last_purchase_date || null,
      new Date(),
      data.customer_type || 'regular',
    ];
    
    const result = await query(sql, params);
    return { id: result.insertId, ...data, phone };
  },
  getCustomerRecords: async (queryParams) => {
    const conditions = [];
    const params = [];
    if (queryParams.location) {
      conditions.push('location = ?');
      params.push(queryParams.location);
    }
    if (queryParams.gender) {
      conditions.push('gender = ?');
      params.push(queryParams.gender);
    }
    if (queryParams.customer_type) {
      conditions.push('customer_type = ?');
      params.push(queryParams.customer_type);
    }
    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const results = await query(`SELECT * FROM customers ${whereClause} ORDER BY created_at DESC`, params);
    return results;
  },
  getCustomerRecordById: async (id) => {
    const results = await query('SELECT * FROM customers WHERE id = ?', [id]);
    if (!results.length) {
      const error = new Error('Customer not found');
      error.status = 404;
      throw error;
    }
    return results[0];
  },
  updateCustomerRecord: async (id, data) => {
    const fields = [];
    const params = [];
    const allowed = ['name', 'email', 'phone', 'gender', 'location', 'last_purchase_date'];
    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(key === 'phone' ? normalizePhoneNumber(data.phone) : data[key]);
      }
    }
    if (!fields.length) {
      return await module.exports.getCustomerRecordById(id);
    }
    params.push(id);
    await query(`UPDATE customers SET ${fields.join(', ')} WHERE id = ?`, params);
    return await module.exports.getCustomerRecordById(id);
  },
  deleteCustomerRecord: async (id) => {
    const result = await query('DELETE FROM customers WHERE id = ?', [id]);
    return result;
  },
};
