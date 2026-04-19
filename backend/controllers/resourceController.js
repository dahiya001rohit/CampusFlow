const Resource = require('../models/Resource');

// @desc   Get all resources
// @route  GET /api/resources
// @access Private
const getResources = async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc   Get a single resource
// @route  GET /api/resources/:id
// @access Private
const getResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json(resource);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc   Create a resource (Admin)
// @route  POST /api/resources
// @access Admin
const createResource = async (req, res) => {
  const { name, type, description, capacity, location } = req.body;
  try {
    const resource = await Resource.create({ name, type, description, capacity, location });
    res.status(201).json(resource);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc   Update a resource (Admin)
// @route  PUT /api/resources/:id
// @access Admin
const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json(resource);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc   Delete a resource (Admin)
// @route  DELETE /api/resources/:id
// @access Admin
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json({ message: 'Resource deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getResources, getResource, createResource, updateResource, deleteResource };
