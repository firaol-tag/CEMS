const { query } = require('../config/db');
const { fetchPendingJobs, updateJob, enqueueMessage } = require('../config/queue');
const { sendEmail } = require('../config/mailer');
const { sendSms } = require('../API/services/sms.service');
const { selectCustomersForCampaign } = require('../API/services/campaign.service');

async function processJob(job) {
  const customers = await query('SELECT * FROM customers WHERE id = ?', [job.customer_id]);
  if (!customers.length) {
    await updateJob(job.id, { status: 'failed' });
    return;
  }

  const customer = customers[0];
  try {
    if (job.channel === 'email') {
      await sendEmail({
        to: customer.email,
        subject: job.subject || 'Campaign message from CEMS',
        html: `<p>${job.message || 'Hello from CEMS!'}</p>`,
      });
    } else if (job.channel === 'sms') {
      await sendSms({
        to: customer.phone,
        message: job.message || 'Hello from CEMS! Check your latest campaign.',
      });
    }
    await updateJob(job.id, { status: 'sent' });
  } catch (error) {
    const retryCount = job.retry_count + 1;
    const status = retryCount >= 3 ? 'failed' : 'pending';
    await updateJob(job.id, { status, retry_count: retryCount });
  }
}

async function hydrateJobs(jobs) {
  if (!jobs.length) return jobs;

  const campaignMap = {};
  const campaignIds = [...new Set(jobs.map(job => job.campaign_id))];
  if (campaignIds.length) {
    const placeholders = campaignIds.map(() => '?').join(',');
    const rows = await query(
      `SELECT id, title, message FROM campaigns WHERE id IN (${placeholders})`,
      campaignIds
    );
    rows.forEach(row => { campaignMap[row.id] = row; });
  }
  return jobs.map(job => ({
    ...job,
    message: campaignMap[job.campaign_id]?.message,
    subject: campaignMap[job.campaign_id]?.title
  }));
}

async function checkScheduledCampaigns() {
  const rows = await query(
    `SELECT * FROM campaigns WHERE status = 'scheduled' AND scheduled_at <= NOW()`
  );
  for (const campaign of rows) {
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
            scheduled_at: new Date(),
          })
        );
      }
    }
    await Promise.all(queueJobs);
    await query(`UPDATE campaigns SET status = 'sent' WHERE id = ?`, [campaign.id]);
  }
}

async function runWorker() {
  console.log('Queue worker started');
  while (true) {
    try {
      await checkScheduledCampaigns();
      const pendingJobs = await fetchPendingJobs(50);
      const hydrated = await hydrateJobs(pendingJobs);
      for (const job of hydrated) {
        await processJob(job);
      }
    } catch (error) {
      console.error('Worker error', error.message || error);
    }
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

module.exports = { runWorker };

runWorker().catch(err => {
  console.error('Worker crashed', err);
  process.exit(1);
});
