const {
  createSegmentRecord,
  getSegmentRecords,
  getSegmentRecordById,
  updateSegmentRecord,
  deleteSegmentRecord,
} = require('../services/segment.service');

async function createSegment(req, res) {
  const segment = await createSegmentRecord(req.body);
  res.status(201).json(segment);
}

async function getSegments(req, res) {
  const segments = await getSegmentRecords();
  res.json(segments);
}

async function getSegmentById(req, res) {
  const segment = await getSegmentRecordById(req.params.id);
  res.json(segment);
}

async function updateSegment(req, res) {
  const segment = await updateSegmentRecord(req.params.id, req.body);
  res.json(segment);
}

async function deleteSegment(req, res) {
  await deleteSegmentRecord(req.params.id);
  res.status(204).end();
}

module.exports = { createSegment, getSegments, getSegmentById, updateSegment, deleteSegment };
