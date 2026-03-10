const Lesson = require('../models/Lesson');

/**
 * @desc    Create a new lesson
 * @route   POST /api/lessons
 * @access  Private (Mentors only)
 */
const createLesson = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    // Mentor creates lesson with their own ID
    const lesson = await Lesson.create({
      title,
      description,
      mentorId: req.user.id
    });

    res.status(201).json({
      success: true,
      data: lesson
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all lessons
 * @route   GET /api/lessons
 * @access  Private (All authenticated users)
 */
const getLessons = async (req, res, next) => {
  try {
    let query = {};

    // Optionally filter by mentor
    if (req.query.mentorId) {
      query.mentorId = req.query.mentorId;
    }

    const lessons = await Lesson.find(query).populate('mentorId', 'name email');

    res.status(200).json({
      success: true,
      count: lessons.length,
      data: lessons
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLesson,
  getLessons
};
