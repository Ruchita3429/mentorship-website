const express = require('express');
const { createSession, getSessionsByLesson } = require('../controllers/sessionController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', protect, authorize('mentor'), createSession);

module.exports = router;
