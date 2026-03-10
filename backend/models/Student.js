const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide student name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Parent ID is required'],
    validate: {
      validator: async function(value) {
        const User = mongoose.model('User');
        const parent = await User.findById(value);
        return parent && parent.role === 'parent';
      },
      message: 'Invalid parent ID or user is not a parent'
    }
  }
}, {
  timestamps: true
});

// Index for faster queries
studentSchema.index({ parentId: 1 });

module.exports = mongoose.model('Student', studentSchema);
