const Booking = require('../models/Booking');
const Student = require('../models/Student');
const Lesson = require('../models/Lesson');

/**
 * @desc    Create a new booking
 * @route   POST /api/bookings
 * @access  Private (Parents only)
 */
const createBooking = async (req, res, next) => {
  try {
    const { studentId, lessonId } = req.body;

    // Verify student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Verify parent owns the student
    if (student.parentId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to book for this student'
      });
    }

    // Verify lesson exists
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Create booking
    const booking = await Booking.create({
      studentId,
      lessonId
    });

    // Populate the booking with student and lesson details
    await booking.populate([
      { path: 'studentId', select: 'name' },
      { path: 'lessonId', select: 'title description' }
    ]);

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    // Handle duplicate booking error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This student is already booked for this lesson'
      });
    }
    next(error);
  }
};

module.exports = {
  createBooking
};
