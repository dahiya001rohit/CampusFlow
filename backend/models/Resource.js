const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ['lab', 'classroom', 'auditorium', 'sports', 'other'],
    },
    description: { type: String, trim: true },
    capacity: { type: Number, default: 0 },
    location: { type: String, trim: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', resourceSchema);
