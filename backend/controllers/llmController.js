const { summarizeText } = require('../utils/summarize');

/**
 * @desc    Summarize text using OpenAI
 * @route   POST /api/llm/summarize
 * @access  Private (All authenticated users)
 */
const summarize = async (req, res, next) => {
  try {
    const { text } = req.body;

    // Validate text is provided
    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text is required for summarization'
      });
    }

    // Validate text length - minimum 50 characters
    if (text.length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Text must be at least 50 characters long'
      });
    }

    // Validate text length - maximum 8000 characters
    if (text.length > 8000) {
      return res.status(413).json({
        success: false,
        message: 'Text exceeds maximum length of 8000 characters'
      });
    }

    // Generate summary using OpenAI
    const summary = await summarizeText(text);

    res.status(200).json({
      success: true,
      summary,
      model: 'gpt-4o-mini'
    });
  } catch (error) {
    // Handle OpenAI API errors
    if (error.message === 'Failed to generate summary') {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate summary. Please try again later.'
      });
    }
    next(error);
  }
};

module.exports = {
  summarize
};
