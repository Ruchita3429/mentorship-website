const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide lesson title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide lesson description'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Mentor ID is required'],
    validate: {
      validator: async function(value) {
        const User = mongoose.model('User');
        const mentor = await User.findById(value);
        return mentor && mentor.role === 'mentor';
      },
      message: 'Invalid mentor ID or user is not a mentor'
    }
  }
}, {
  timestamps: true
});

// Index for faster queries
lessonSchema.index({ mentorId: 1 });

module.exports = mongoose.model('Lesson', lessonSchema);
