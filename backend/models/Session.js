const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: [true, 'Lesson ID is required']
  },
  date: {
    type: Date,
    required: [true, 'Session date is required']
  },
  topic: {
    type: String,
    required: [true, 'Session topic is required'],
    trim: true,
    maxlength: [200, 'Topic cannot exceed 200 characters']
  },
  summary: {
    type: String,
    trim: true,
    maxlength: [1000, 'Summary cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Index for faster queries
sessionSchema.index({ lessonId: 1 });
sessionSchema.index({ date: -1 });

module.exports = mongoose.model('Session', sessionSchema);
