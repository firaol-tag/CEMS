const connectDb = require('../../config/db');

module.exports = {
  createCustomerRecord: (data, callback) => {
    const sql = `INSERT INTO customers (name, email, phone, gender, location, last_purchase_date, created_at, customer_type)
      VALUES (?)`;
    const params = [
      data.name,
      data.email,
      data.phone,
      data.gender,
      data.location,
      data.last_purchase_date || null,
      new Date(),
      data.customer_type || 'regular',
    ];

    connectDb.query(sql, [params], (err, result) => {
      if (err){
        console.log(err) 
        return callback(err)};
      console.log(result.insertId)
      return callback(null, { id: result.insertId, ...data });
    });
  },
  getCustomerRecords: (query, callback) => {
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
    if (query.customer_type) {
      conditions.push('customer_type = ?');
      params.push(query.customer_type);
    }
    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    connectDb.query(`SELECT * FROM customers ${whereClause} ORDER BY created_at DESC`, params, (err, results) => {
      if (err) return callback(err);
      return callback(null, results);
    });
  },
  getCustomerRecordById: (id, callback) => {
    connectDb.query('SELECT * FROM customers WHERE id = ?', [id], (err, results) => {
      if (err) return callback(err);
      if (!results.length) {
        const error = new Error('Customer not found');
        error.status = 404;
        return callback(error);
      }
      return callback(null, results[0]);
    });
  },
  updateCustomerRecord: (id, data, callback) => {
    const fields = [];
    const params = [];
    const allowed = ['name', 'email', 'phone', 'gender', 'location', 'last_purchase_date'];
    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(data[key]);
      }
    }
    if (!fields.length) {
      return getCustomerRecordById(id, callback);
    }
    params.push(id);
    connectDb.query(`UPDATE customers SET ${fields.join(', ')} WHERE id = ?`, params, (err, result) => {
      if (err) return callback(err);
      getCustomerRecordById(id, callback);
    });
  },
  deleteCustomerRecord: (id, callback) => {
    connectDb.query('DELETE FROM customers WHERE id = ?', [id], (err, result) => {
      if (err) return callback(err);
      return callback(null, result);
    });
  },
};
