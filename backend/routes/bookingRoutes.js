const express = require('express');
const { createBooking } = require('../controllers/bookingController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', protect, authorize('parent'), createBooking);

module.exports = router;
