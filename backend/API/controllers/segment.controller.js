const {
  createSegmentRecord,
  getSegmentRecords,
  getSegmentRecordById,
  updateSegmentRecord,
  deleteSegmentRecord,
} = require('../services/segment.service');

module.exports = {
  createSegment: async (req, res) => {
    try {
      const segment = await createSegmentRecord(req.body);
      res.status(201).json(segment);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },
  getSegments: async (req, res) => {
    try {
      const segments = await getSegmentRecords();
      res.json(segments);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },
  getSegmentById: async (req, res) => {
    try {
      const segment = await getSegmentRecordById(req.params.id);
      res.json(segment);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },
  updateSegment: async (req, res) => {
    try {
      const segment = await updateSegmentRecord(req.params.id, req.body);
      res.json(segment);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },
  deleteSegment: async (req, res) => {
    try {
      await deleteSegmentRecord(req.params.id);
      res.status(204).end();
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },
};
