const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  scheduleCampaign,
  sendCampaignNow,
} = require('../controllers/campaign.controller');

const router = express.Router();
router.use(authMiddleware);
router.post('/', createCampaign);
router.get('/', getCampaigns);
router.get('/:id', getCampaignById);
router.put('/:id', updateCampaign);
router.post('/:id/schedule', scheduleCampaign);
router.post('/:id/send', sendCampaignNow);

module.exports = router;
