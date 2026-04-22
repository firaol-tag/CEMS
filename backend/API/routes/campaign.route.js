const express = require('express');
const authMiddleware = require('../../middleware/auth');
const {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
} = require('../controllers/campaign.controller');

const router = express.Router();
router.use(authMiddleware);
router.post('/', createCampaign);
router.get('/', getCampaigns);
router.get('/:id', getCampaignById);
router.put('/:id', updateCampaign);

module.exports = router;
