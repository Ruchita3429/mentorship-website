const Student = require('../models/Student');

/**
 * @desc    Create a new student
 * @route   POST /api/students
 * @access  Private (Parents only)
 */
const createStudent = async (req, res, next) => {
  try {
    const { name } = req.body;

    // Parent creates student with their own ID
    const student = await Student.create({
      name,
      parentId: req.user.id
    });

    res.status(201).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all students
 * @route   GET /api/students
 * @access  Private (Parents see their own, Mentors see all)
 */
const getStudents = async (req, res, next) => {
  try {
    let query = {};

    // If user is a parent, only show their students
    if (req.user.role === 'parent') {
      query.parentId = req.user.id;
    }

    const students = await Student.find(query).populate('parentId', 'name email');

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStudent,
  getStudents
};
