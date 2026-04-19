const Booking = require('../models/Booking');
const Resource = require('../models/Resource');

// @desc   Create a booking request (Student)
// @route  POST /api/bookings
// @access Private (Student)
const createBooking = async (req, res) => {
  const { resourceId, startTime, endTime, purpose } = req.body;
  try {
    const resource = await Resource.findById(resourceId);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    if (!resource.isAvailable) return res.status(400).json({ message: 'Resource is not available' });

    // Check for time conflicts on approved bookings
    const conflict = await Booking.findOne({
      resource: resourceId,
      status: 'approved',
      $or: [
        { startTime: { $lt: new Date(endTime), $gte: new Date(startTime) } },
        { endTime: { $gt: new Date(startTime), $lte: new Date(endTime) } },
        { startTime: { $lte: new Date(startTime) }, endTime: { $gte: new Date(endTime) } },
      ],
    });
    if (conflict) return res.status(400).json({ message: 'Resource is already booked for this time slot' });

    const booking = await Booking.create({
      user: req.user._id,
      resource: resourceId,
      startTime,
      endTime,
      purpose,
    });
    await booking.populate(['user', 'resource']);
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc   Get my bookings (Student)
// @route  GET /api/bookings/my
// @access Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('resource', 'name type location')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc   Get all bookings (Admin)
// @route  GET /api/bookings
// @access Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('resource', 'name type location')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc   Update booking status (Admin)
// @route  PUT /api/bookings/:id/status
// @access Admin
const updateBookingStatus = async (req, res) => {
  const { status, adminNote } = req.body;
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, adminNote },
      { new: true, runValidators: true }
    ).populate(['user', 'resource']);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc   Cancel a booking (Student)
// @route  PUT /api/bookings/:id/cancel
// @access Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending bookings can be cancelled' });
    }
    booking.status = 'cancelled';
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createBooking, getMyBookings, getAllBookings, updateBookingStatus, cancelBooking };
