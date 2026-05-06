const { connectDb, query } = require('../../config/db');

module.exports = {
  createSegmentRecord: async (data) => {
    try {
      const result = await query(
        'INSERT INTO customer_segments (name, filter_json, created_at) VALUES (?, ?, ?)',
        [data.name, JSON.stringify(data.filter_json || {}), new Date()]
      );
      return { id: result.insertId, name: data.name, filter_json: data.filter_json || {} };
    } catch (err) {
      throw err;
    }
  },
  getSegmentRecords: async () => {
    try {
      const results = await query('SELECT * FROM customer_segments ORDER BY created_at DESC');
      const segments = results.map(row => ({ ...row, filter_json: JSON.parse(row.filter_json || '{}') }));
      return segments;
    } catch (err) {
      throw err;
    }
  },
  getSegmentRecordById: async (id) => {
    try {
      const results = await query('SELECT * FROM customer_segments WHERE id = ?', [id]);
      if (!results.length) {
        const error = new Error('Segment not found');
        error.status = 404;
        throw error;
      }
      const row = results[0];
      return { ...row, filter_json: JSON.parse(row.filter_json || '{}') };
    } catch (err) {
      throw err;
    }
  },
  updateSegmentRecord: async (id, data) => {
    try {
      const existing = await module.exports.getSegmentRecordById(id);
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
        return existing;
      }
      params.push(id);
      await query(`UPDATE customer_segments SET ${changes.join(', ')} WHERE id = ?`, params);
      return await module.exports.getSegmentRecordById(id);
    } catch (err) {
      throw err;
    }
  },
  deleteSegmentRecord: async (id) => {
    try {
      const result = await query('DELETE FROM customer_segments WHERE id = ?', [id]);
      return result;
    } catch (err) {
      throw err;
    }
  },
};
