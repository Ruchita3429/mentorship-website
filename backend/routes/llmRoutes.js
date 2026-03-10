const express = require('express');
const { summarize } = require('../controllers/llmController');
const protect = require('../middleware/authMiddleware');
const { llmRateLimiter } = require('../middleware/rateLimit');

const router = express.Router();

router.post('/summarize', protect, llmRateLimiter, summarize);

module.exports = router;
