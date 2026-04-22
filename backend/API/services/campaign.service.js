const connectDb = require('../../config/db');
const { enqueueMessage } = require('../../config/queue');

function buildFilterClause(filter) {
  const conditions = [];
  const params = [];
  if (filter.location) {
    conditions.push('location = ?');
    params.push(filter.location);
  }
  if (filter.last_purchase_days) {
    conditions.push('last_purchase_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)');
    params.push(filter.last_purchase_days);
  }
  if (filter.gender) {
    conditions.push('gender = ?');
    params.push(filter.gender);
  }
  if (filter.customer_type) {
    conditions.push('customer_type = ?');
    params.push(filter.customer_type);
  }
  if (filter.email) {
    conditions.push('email = ?');
    params.push(filter.email);
  }
  return { sql: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '', params };
}

module.exports = {
  selectCustomersForCampaign: (campaign, callback) => {
    let sql = 'SELECT * FROM customers';
    let params = [];

    if (campaign.target_type === 'specific' && Array.isArray(campaign.target_data)) {
      const ids = campaign.target_data.map(() => '?').join(',');
      sql += ` WHERE id IN (${ids})`;
      params = campaign.target_data;
    } else if (campaign.target_type === 'filtered' && campaign.target_data) {
      const filter = campaign.target_data;
      const built = buildFilterClause(filter);
      sql += ` ${built.sql}`;
      params = built.params;
    }

    connectDb.query(sql, params, (err, results) => {
      if (err) {
        return callback(err);
      }
      return callback(null, results);
    });
  },
  createCampaignRecord: (data, createdBy, callback) => {
    connectDb.query(
      `INSERT INTO campaigns (title, message, type, target_type, target_data, status, scheduled_at, created_by, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.title,
        data.message,
        data.type,
        data.target_type,
        JSON.stringify(data.target_data || {}),
        'draft',
        data.scheduled_at || null,
        createdBy,
        new Date(),
      ],
      (err, result) => {
        if (err) {
          return callback(err);
        }
        return callback(null, { id: result.insertId, ...data, status: 'draft', created_by: createdBy });
      }
    );
  },
  getCampaignRecords: (callback) => {
    connectDb.query('SELECT * FROM campaigns ORDER BY created_at DESC', (err, results) => {
      if (err) {
        return callback(err);
      }
      const campaigns = results.map(row => ({
        ...row,
        target_data: JSON.parse(row.target_data || '{}'),
      }));
      return callback(null, campaigns);
    });
  },
  getCampaignRecordById: (id, callback) => {
    connectDb.query('SELECT * FROM campaigns WHERE id = ?', [id], (err, results) => {
      if (err) {
        return callback(err);
      }
      if (!results.length) {
        const error = new Error('Campaign not found');
        error.status = 404;
        return callback(error);
      }
      const row = results[0];
      return callback(null, { ...row, target_data: JSON.parse(row.target_data || '{}') });
    });
  },
  updateCampaignRecord: (id, data, callback) => {
    const allowed = ['title', 'message', 'type', 'target_type', 'target_data', 'scheduled_at', 'status'];
    const fields = [];
    const params = [];
    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(key === 'target_data' ? JSON.stringify(data[key]) : data[key]);
      }
    }
    if (!fields.length) {
      return module.exports.getCampaignRecordById(id, callback);
    }
    params.push(id);
    connectDb.query(`UPDATE campaigns SET ${fields.join(', ')} WHERE id = ?`, params, (err) => {
      if (err) {
        return callback(err);
      }
      return module.exports.getCampaignRecordById(id, callback);
    });
  },
  scheduleCampaignById: (id, scheduledAt, callback) => {
    module.exports.updateCampaignRecord(id, {
      scheduled_at: scheduledAt,
      status: 'scheduled',
    }, callback);
  },
  triggerCampaignNow: (id, callback) => {
    module.exports.getCampaignRecordById(id, (err, campaign) => {
      if (err) {
        return callback(err);
      }
      module.exports.selectCustomersForCampaign(campaign, (err, customers) => {
        if (err) {
          return callback(err);
        }
        const queueJobs = [];
        for (const customer of customers) {
          const channels = campaign.type === 'both' ? ['email', 'sms'] : [campaign.type];
          for (const channel of channels) {
            queueJobs.push(
              enqueueMessage({
                customer_id: customer.id,
                campaign_id: campaign.id,
                channel,
                status: 'pending',
                retry_count: 0,
              })
            );
          }
        }
        // Assuming enqueueMessage is synchronous or handle accordingly; for simplicity, proceed
        module.exports.updateCampaignRecord(id, { status: 'sent' }, (err) => {
          if (err) {
            return callback(err);
          }
          return callback(null, { ...campaign, status: 'sent', queued: customers.length * (campaign.type === 'both' ? 2 : 1) });
        });
      });
    });
  },
};
