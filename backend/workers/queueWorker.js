const connectDb = require('../config/db');
const { fetchPendingJobs, updateJob } = require('../config/queue');
const { sendEmail } = require('../config/mailer');
const { sendSms } = require('../services/sms.service');

async function processJob(job) {
  const pool = await connectDb();
  const [customers] = await pool.execute('SELECT * FROM customers WHERE id = ?', [job.customer_id]);
  if (!customers.length) {
    await updateJob(job.id, { status: 'failed' });
    return;
  }

  const customer = customers[0];
  try {
    if (job.channel === 'email') {
      await sendEmail({
        to: customer.email,
        subject: `Campaign message from CEMS`,
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
  const pool = await connectDb();
  const campaignMap = {};
  const campaignIds = [...new Set(jobs.map(job => job.campaign_id))];
  if (campaignIds.length) {
    const [rows] = await pool.execute(
      `SELECT id, message FROM campaigns WHERE id IN (${campaignIds.map(() => '?').join(',')})`,
      campaignIds
    );
    rows.forEach(row => { campaignMap[row.id] = row; });
  }
  return jobs.map(job => ({ ...job, message: campaignMap[job.campaign_id]?.message }));
}

async function runWorker() {
  console.log('Queue worker started');
  while (true) {
    try {
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

runWorker().catch(err => {
  console.error('Worker crashed', err);
  process.exit(1);
});
