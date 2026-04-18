const {
  createCampaignRecord,
  getCampaignRecords,
  getCampaignRecordById,
  updateCampaignRecord,
  scheduleCampaignById,
  triggerCampaignNow,
} = require('../services/campaign.service');

async function createCampaign(req, res) {
  const campaign = await createCampaignRecord(req.body, req.user.id);
  res.status(201).json(campaign);
}

async function getCampaigns(req, res) {
  const campaigns = await getCampaignRecords();
  res.json(campaigns);
}

async function getCampaignById(req, res) {
  const campaign = await getCampaignRecordById(req.params.id);
  res.json(campaign);
}

async function updateCampaign(req, res) {
  const campaign = await updateCampaignRecord(req.params.id, req.body);
  res.json(campaign);
}

async function scheduleCampaign(req, res) {
  const campaign = await scheduleCampaignById(req.params.id, req.body.scheduled_at);
  res.json(campaign);
}

async function sendCampaignNow(req, res) {
  const campaign = await triggerCampaignNow(req.params.id);
  res.json(campaign);
}

module.exports = {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  scheduleCampaign,
  sendCampaignNow,
};
