const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['infrastructure', 'academics', 'hostel', 'facilities', 'other'],
      default: 'other',
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved', 'closed'],
      default: 'open',
    },
    adminResponse: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Complaint', complaintSchema);
