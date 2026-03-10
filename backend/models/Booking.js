const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student ID is required']
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: [true, 'Lesson ID is required']
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate bookings
bookingSchema.index({ studentId: 1, lessonId: 1 }, { unique: true });

// Index for faster queries
bookingSchema.index({ lessonId: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
