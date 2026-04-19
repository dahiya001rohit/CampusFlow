const Booking = require('../models/Booking');
const Complaint = require('../models/Complaint');
const Resource = require('../models/Resource');
const User = require('../models/User');

// @desc   Get dashboard stats
// @route  GET /api/stats
// @access Private
const getStats = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';

    if (isAdmin) {
      const [
        totalUsers,
        totalResources,
        totalBookings,
        pendingBookings,
        approvedBookings,
        rejectedBookings,
        totalComplaints,
        openComplaints,
        inProgressComplaints,
        resolvedComplaints,
        recentBookings,
        recentComplaints,
      ] = await Promise.all([
        User.countDocuments({ role: 'student' }),
        Resource.countDocuments(),
        Booking.countDocuments(),
        Booking.countDocuments({ status: 'pending' }),
        Booking.countDocuments({ status: 'approved' }),
        Booking.countDocuments({ status: 'rejected' }),
        Complaint.countDocuments(),
        Complaint.countDocuments({ status: 'open' }),
        Complaint.countDocuments({ status: 'in-progress' }),
        Complaint.countDocuments({ status: 'resolved' }),
        Booking.find()
          .populate('user', 'name email')
          .populate('resource', 'name type')
          .sort({ createdAt: -1 })
          .limit(5)
          .lean(),
        Complaint.find()
          .populate('user', 'name email')
          .sort({ createdAt: -1 })
          .limit(5)
          .lean(),
      ]);

      res.json({
        totalUsers,
        totalResources,
        bookings: { total: totalBookings, pending: pendingBookings, approved: approvedBookings, rejected: rejectedBookings },
        complaints: { total: totalComplaints, open: openComplaints, inProgress: inProgressComplaints, resolved: resolvedComplaints },
        recentBookings,
        recentComplaints,
      });
    } else {
      const userId = req.user._id;
      const [
        totalBookings,
        pendingBookings,
        approvedBookings,
        rejectedBookings,
        totalComplaints,
        openComplaints,
        inProgressComplaints,
        resolvedComplaints,
        recentBookings,
        recentComplaints,
      ] = await Promise.all([
        Booking.countDocuments({ user: userId }),
        Booking.countDocuments({ user: userId, status: 'pending' }),
        Booking.countDocuments({ user: userId, status: 'approved' }),
        Booking.countDocuments({ user: userId, status: 'rejected' }),
        Complaint.countDocuments({ user: userId }),
        Complaint.countDocuments({ user: userId, status: 'open' }),
        Complaint.countDocuments({ user: userId, status: 'in-progress' }),
        Complaint.countDocuments({ user: userId, status: 'resolved' }),
        Booking.find({ user: userId })
          .populate('resource', 'name type')
          .sort({ createdAt: -1 })
          .limit(5)
          .lean(),
        Complaint.find({ user: userId })
          .sort({ createdAt: -1 })
          .limit(5)
          .lean(),
      ]);

      res.json({
        bookings: { total: totalBookings, pending: pendingBookings, approved: approvedBookings, rejected: rejectedBookings },
        complaints: { total: totalComplaints, open: openComplaints, inProgress: inProgressComplaints, resolved: resolvedComplaints },
        recentBookings,
        recentComplaints,
      });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getStats };
