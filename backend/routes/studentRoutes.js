const express = require('express');
const { createStudent, getStudents } = require('../controllers/studentController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, authorize('parent'), createStudent)
  .get(protect, getStudents);

module.exports = router;
