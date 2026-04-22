const {connectDb} = require('./db');

async function enqueueMessage(job) {

  const sql = `INSERT INTO message_queue (customer_id, campaign_id, channel, status, retry_count, scheduled_at, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const params = [
    job.customer_id,
    job.campaign_id,
    job.channel,
    job.status || 'pending',
    job.retry_count || 0,
    job.scheduled_at || new Date(),
    new Date(),
  ];
  await connectDb.query(sql, params);
}

async function fetchPendingJobs(limit = 100) {

  const [rows] = await connectDb.query(
    `SELECT * FROM message_queue WHERE status = 'pending' ORDER BY created_at ASC LIMIT ?`,
    [limit]
  );
  return rows;
}

async function updateJob(jobId, updates) {

  const sets = [];
  const params = [];
  for (const key of Object.keys(updates)) {
    sets.push(`${key} = ?`);
    params.push(updates[key]);
  }
  sets.push('updated_at = ?');
  params.push(new Date());
  params.push(jobId);
  await connectDb.query(`UPDATE message_queue SET ${sets.join(', ')} WHERE id = ?`, params);
}

module.exports = { enqueueMessage, fetchPendingJobs, updateJob };
