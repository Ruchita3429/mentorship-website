const express = require('express');
const { createLesson, getLessons } = require('../controllers/lessonController');
const { getSessionsByLesson } = require('../controllers/sessionController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, authorize('mentor'), createLesson)
  .get(protect, getLessons);

router.get('/:id/sessions', protect, getSessionsByLesson);

module.exports = router;
