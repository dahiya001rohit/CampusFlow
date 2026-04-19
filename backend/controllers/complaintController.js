const Complaint = require('../models/Complaint');

// @desc   Create a complaint (Student)
// @route  POST /api/complaints
// @access Private
const createComplaint = async (req, res) => {
  const { title, description, category } = req.body;
  try {
    const complaint = await Complaint.create({
      user: req.user._id,
      title,
      description,
      category,
    });
    await complaint.populate('user', 'name email');
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc   Get my complaints (Student)
// @route  GET /api/complaints/my
// @access Private
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc   Get all complaints (Admin)
// @route  GET /api/complaints
// @access Admin
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc   Update complaint status (Admin)
// @route  PUT /api/complaints/:id/status
// @access Admin
const updateComplaintStatus = async (req, res) => {
  const { status, adminResponse } = req.body;
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status, adminResponse },
      { new: true, runValidators: true }
    ).populate('user', 'name email');
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createComplaint, getMyComplaints, getAllComplaints, updateComplaintStatus };
