const { connectDb, query } = require('../../config/db');
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
  selectCustomersForCampaign: async (campaign) => {
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

    const results = await query(sql, params);
    return results;
  },
  createCampaignRecord: async (data, createdBy) => {
    const status = data.scheduled_at ? 'scheduled' : 'draft';
    const result = await query(
      `INSERT INTO campaigns (title, message, type, target_type, target_data, status, scheduled_at, created_by, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.title,
        data.message,
        data.type,
        data.target_type,
        JSON.stringify(data.target_data || {}),
        status,
        data.scheduled_at || null,
        createdBy,
        new Date(),
      ]
    );
    return { id: result.insertId, ...data, status, created_by: createdBy };
  },
  getCampaignRecords: async () => {
    const results = await query('SELECT * FROM campaigns ORDER BY created_at DESC');
    const campaigns = results.map(row => ({
      ...row,
      target_data: JSON.parse(row.target_data || '{}'),
    }));
    return campaigns;
  },
  getCampaignRecordById: async (id) => {
    const results = await query('SELECT * FROM campaigns WHERE id = ?', [id]);
    if (!results.length) {
      const error = new Error('Campaign not found');
      error.status = 404;
      throw error;
    }
    const row = results[0];
    return { ...row, target_data: JSON.parse(row.target_data || '{}') };
  },
  updateCampaignRecord: async (id, data) => {
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
      return await module.exports.getCampaignRecordById(id);
    }
    params.push(id);
    await query(`UPDATE campaigns SET ${fields.join(', ')} WHERE id = ?`, params);
    return await module.exports.getCampaignRecordById(id);
  },
  scheduleCampaignById: async (id, scheduledAt) => {
    return await module.exports.updateCampaignRecord(id, {
      scheduled_at: scheduledAt,
      status: 'scheduled',
    });
  },
  triggerCampaignNow: async (id) => {
    const campaign = await module.exports.getCampaignRecordById(id);
    const customers = await module.exports.selectCustomersForCampaign(campaign);
    const queueJobs = [];
    for (const customer of customers) {
      const channels = campaign.type === 'both' ? ['email', 'sms'] : [campaign.type];
      for (const channel of channels) {
        await enqueueMessage({
          customer_id: customer.id,
          campaign_id: campaign.id,
          channel,
          status: 'pending',
          retry_count: 0,
        });
      }
    }
    const updated = await module.exports.updateCampaignRecord(id, { status: 'sent' });
    return { ...updated, queued: customers.length * (campaign.type === 'both' ? 2 : 1) };
  },
};
