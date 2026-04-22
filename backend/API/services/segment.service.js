const connectDb = require('../../config/db');
const util = require('util');
const query = util.promisify(connectDb.query).bind(connectDb);

module.exports = {
  createSegmentRecord: (data, callback) => {
    connectDb.query(
      'INSERT INTO customer_segments (name, filter_json, created_at) VALUES (?, ?, ?)',
      [data.name, JSON.stringify(data.filter_json || {}), new Date()],
      (err, result) => {
        if (err) return callback(err);
        return callback(null, { id: result.insertId, name: data.name, filter_json: data.filter_json || {} });
      }
    );
  },
  getSegmentRecords: (callback) => {
    connectDb.query('SELECT * FROM customer_segments ORDER BY created_at DESC', (err, results) => {
      if (err) return callback(err);
      const segments = results.map(row => ({ ...row, filter_json: JSON.parse(row.filter_json || '{}') }));
      return callback(null, segments);
    });
  },
  getSegmentRecordById: (id, callback) => {
    connectDb.query('SELECT * FROM customer_segments WHERE id = ?', [id], (err, results) => {
      if (err) return callback(err);
      if (!results.length) {
        const error = new Error('Segment not found');
        error.status = 404;
        return callback(error);
      }
      const row = results[0];
      return callback(null, { ...row, filter_json: JSON.parse(row.filter_json || '{}') });
    });
  },
  updateSegmentRecord: (id, data, callback) => {
    connectDb.query('SELECT * FROM customer_segments WHERE id = ?', [id], (err, results) => {
      if (err) return callback(err);
      if (!results.length) {
        const error = new Error('Segment not found');
        error.status = 404;
        return callback(error);
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
      if (!changes.length) {
        return module.exports.getSegmentRecordById(id, callback);
      }
      params.push(id);
      connectDb.query(`UPDATE customer_segments SET ${changes.join(', ')} WHERE id = ?`, params, (err, result) => {
        if (err) return callback(err);
        module.exports.getSegmentRecordById(id, callback);
      });
    });
  },
  deleteSegmentRecord: (id, callback) => {
    connectDb.query('DELETE FROM customer_segments WHERE id = ?', [id], (err, result) => {
      if (err) return callback(err);
      return callback(null, result);
    });
  },
};
