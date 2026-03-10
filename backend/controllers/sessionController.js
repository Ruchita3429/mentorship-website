const Session = require('../models/Session');
const Lesson = require('../models/Lesson');

/**
 * @desc    Create a new session
 * @route   POST /api/sessions
 * @access  Private (Mentors only)
 */
const createSession = async (req, res, next) => {
  try {
    const { lessonId, date, topic, summary } = req.body;

    // Verify lesson exists
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Verify mentor owns the lesson
    if (lesson.mentorId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create sessions for this lesson'
      });
    }

    // Create session
    const session = await Session.create({
      lessonId,
      date,
      topic,
      summary
    });

    res.status(201).json({
      success: true,
      data: session
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all sessions for a lesson
 * @route   GET /api/lessons/:id/sessions
 * @access  Private (All authenticated users)
 */
const getSessionsByLesson = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verify lesson exists
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Get sessions for this lesson, sorted by date (newest first)
    const sessions = await Session.find({ lessonId: id })
      .sort({ date: -1 })
      .populate('lessonId', 'title');

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSession,
  getSessionsByLesson
};
