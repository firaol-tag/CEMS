const {
  createCampaignRecord,
  getCampaignRecords,
  getCampaignRecordById,
  updateCampaignRecord,
} = require('../services/campaign.service');

module.exports = {
  createCampaign: (req, res) => {
    createCampaignRecord(req.body, req.user.id, (err, campaign) => {
      if (err) {
        return res.status(err.status || 500).json({ message: err.message });
      }
      res.status(201).json(campaign);
    });
  },
  getCampaigns: (req, res) => {
    getCampaignRecords((err, campaigns) => {
      if (err) {
        return res.status(err.status || 500).json({ message: err.message });
      }
      res.json(campaigns);
    });
  },
  getCampaignById: (req, res) => {
    getCampaignRecordById(req.params.id, (err, campaign) => {
      if (err) {
        return res.status(err.status || 500).json({ message: err.message });
      }
      res.json(campaign);
    });
  },
  updateCampaign: (req, res) => {
    updateCampaignRecord(req.params.id, req.body, (err, campaign) => {
      if (err) {
        return res.status(err.status || 500).json({ message: err.message });
      }
      res.json(campaign);
    });
  },
};
