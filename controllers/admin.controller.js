const Admin = require('../models/admin.model');
const { findMostRecentAdmin } = require('./UniqueIdGenerator/admin/adminIdGenerator');

// CRUD operations

// Create a new admin
const createAdmin = async (req, res) => {
  try {
    const { name, email, phoneNumber, address, password, roles } = req.body;
    console.log(req.body);
    const last_sequence_number = await findMostRecentAdmin();
    const current_sequence_number = last_sequence_number + 1;
    const unique_admin_id = `RC-A-${current_sequence_number}`;

    let admin_image = null;
    let imageMimeType = null;

    // Check if there's an image uploaded in the request
    if (req.file && req.file.buffer) {
      // Set the image data and MIME type
      admin_image = req.file.buffer;
      imageMimeType = req.file.mimetype;
    }

    const data = {
      readicharge_unique_id: unique_admin_id,
      admin_image: admin_image,
      imageMimeType: imageMimeType,
      name,
      email,
      phoneNumber,
      address,
      password,
      roles,
      sequence_number: current_sequence_number,
    };

    console.log(data);

    const admin = await Admin.create(data);

    res.status(201).json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const getAdmin = async (req, res) => {
  try {
    const admin = await Admin.find();
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the admin.' });
  }
};

// Read admin by ID
const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      res.status(404).json({ error: 'Admin not found.' });
      return;
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the admin.' });
  }
};

// Update admin by ID
const updateAdminById = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!admin) {
      res.status(404).json({ error: 'Admin not found.' });
      return;
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the admin.' });
  }
};

// Delete admin by ID
const deleteAdminById = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      res.status(404).json({ error: 'Admin not found.' });
      return;
    }
    res.json({ message: 'Admin deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the admin.' });
  }
};



module.exports = {
  getAdmin,
  createAdmin,
  getAdminById,
  updateAdminById,
  deleteAdminById
};
