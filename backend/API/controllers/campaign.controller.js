const {
  createCampaignRecord,
  getCampaignRecords,
  getCampaignRecordById,
  updateCampaignRecord,
  scheduleCampaignById,
  triggerCampaignNow,
} = require('../services/campaign.service');

module.exports = {
  createCampaign: async (req, res) => {
    try {
      const campaign = await createCampaignRecord(req.body, req.user.id);
      res.status(201).json(campaign);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },
  getCampaigns: async (req, res) => {
    try {
      const campaigns = await getCampaignRecords();
      res.json(campaigns);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },
  getCampaignById: async (req, res) => {
    try {
      const campaign = await getCampaignRecordById(req.params.id);
      res.json(campaign);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },
  updateCampaign: async (req, res) => {
    try {
      const campaign = await updateCampaignRecord(req.params.id, req.body);
      res.json(campaign);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },
  scheduleCampaign: async (req, res) => {
    try {
      const { scheduled_at } = req.body;
      const campaign = await scheduleCampaignById(req.params.id, scheduled_at);
      res.json(campaign);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },
  sendCampaignNow: async (req, res) => {
    try {
      const result = await triggerCampaignNow(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },
};
