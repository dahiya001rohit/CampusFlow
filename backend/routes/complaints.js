const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
} = require('../controllers/complaintController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', protect, createComplaint);
router.get('/my', protect, getMyComplaints);
router.get('/', protect, adminOnly, getAllComplaints);
router.put('/:id/status', protect, adminOnly, updateComplaintStatus);

module.exports = router;
