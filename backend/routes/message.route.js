const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getMessages, getMessageById } = require('../controllers/message.controller');

const router = express.Router();
router.use(authMiddleware);
router.get('/', getMessages);
router.get('/:id', getMessageById);

module.exports = router;
