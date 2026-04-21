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

async function selectCustomersForCampaign(campaign) {
  const pool = await connectDb();
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

  const [rows] = await pool.query(sql, params);
  return rows;
}

async function createCampaignRecord(data, createdBy) {
  const pool = await connectDb();
  const [result] = await pool.query(
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
    ]
  );
  return { id: result.insertId, ...data, status: 'draft', created_by: createdBy };
}

async function getCampaignRecords() {
  const pool = await connectDb();
  const [rows] = await pool.query('SELECT * FROM campaigns ORDER BY created_at DESC');
  return rows.map(row => ({
    ...row,
    target_data: JSON.parse(row.target_data || '{}'),
  }));
}

async function getCampaignRecordById(id) {
  const pool = await connectDb();
  const [rows] = await pool.query('SELECT * FROM campaigns WHERE id = ?', [id]);
  if (!rows.length) {
    const err = new Error('Campaign not found');
    err.status = 404;
    throw err;
  }
  const row = rows[0];
  return { ...row, target_data: JSON.parse(row.target_data || '{}') };
}

async function updateCampaignRecord(id, data) {
  const pool = await connectDb();
  const allowed = ['title', 'message', 'type', 'target_type', 'target_data', 'scheduled_at', 'status'];
  const fields = [];
  const params = [];
  for (const key of allowed) {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`);
      params.push(key === 'target_data' ? JSON.stringify(data[key]) : data[key]);
    }
  }
  if (!fields.length) return getCampaignRecordById(id);
  params.push(id);
  await pool.query(`UPDATE campaigns SET ${fields.join(', ')} WHERE id = ?`, params);
  return getCampaignRecordById(id);
}

async function scheduleCampaignById(id, scheduledAt) {
  const campaign = await updateCampaignRecord(id, {
    scheduled_at: scheduledAt,
    status: 'scheduled',
  });
  return campaign;
}

async function triggerCampaignNow(id) {
  const campaign = await getCampaignRecordById(id);
  const customers = await selectCustomersForCampaign(campaign);
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
  await Promise.all(queueJobs);
  await updateCampaignRecord(id, { status: 'sent' });
  return { ...campaign, status: 'sent', queued: customers.length * (campaign.type === 'both' ? 2 : 1) };
}

module.exports = {
  createCampaignRecord,
  getCampaignRecords,
  getCampaignRecordById,
  updateCampaignRecord,
  scheduleCampaignById,
  triggerCampaignNow,
  selectCustomersForCampaign,
};
