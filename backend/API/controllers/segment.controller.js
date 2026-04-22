const {
  createSegmentRecord,
  getSegmentRecords,
  getSegmentRecordById,
  updateSegmentRecord,
  deleteSegmentRecord,
} = require('../services/segment.service');

module.exports = {
  createSegment: (req, res) => {
    createSegmentRecord(req.body, (err, segment) => {
      if (err) {
        return res.status(err.status || 500).json({ message: err.message });
      }
      res.status(201).json(segment);
    });
  },
  getSegments: async (req, res) => {
    try {
      const segments = await getSegmentRecords();
      res.json(segments);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },
  getSegmentById: (req, res) => {
    getSegmentRecordById(req.params.id, (err, segment) => {
      if (err) {
        return res.status(err.status || 500).json({ message: err.message });
      }
      res.json(segment);
    });
  },
  updateSegment: (req, res) => {
    updateSegmentRecord(req.params.id, req.body, (err, segment) => {
      if (err) {
        return res.status(err.status || 500).json({ message: err.message });
      }
      res.json(segment);
    });
  },
  deleteSegment: (req, res) => {
    deleteSegmentRecord(req.params.id, (err, result) => {
      if (err) {
        return res.status(err.status || 500).json({ message: err.message });
      }
      res.status(204).end();
    });
  },
};
