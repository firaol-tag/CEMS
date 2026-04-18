const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {
  createSegment,
  getSegments,
  getSegmentById,
  updateSegment,
  deleteSegment,
} = require('../controllers/segment.controller');

const router = express.Router();
router.use(authMiddleware);
router.post('/', createSegment);
router.get('/', getSegments);
router.get('/:id', getSegmentById);
router.put('/:id', updateSegment);
router.delete('/:id', deleteSegment);

module.exports = router;
