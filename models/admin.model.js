const mongoose = require('mongoose');


// For the admin 
const adminSchema = new mongoose.Schema({
  readicharge_unique_id:{
        type: String,
        required: true
    },
  sequence_number:{
    type: Number,
    required: true
  },
  admin_image: {
    type: Buffer, // Used 'Buffer' data type to store binary data (image)
  },
  imageMimeType: {
    type: String, // Stored the MIME type of the image (e.g., 'image/jpeg', 'image/png', etc.)
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  // We will have 7 Primary types of services with which we are going to help the Admins 
  roles: {
    type: [{
      type: String,
      enum: ['Installer', 'Customer', 'Service','Company', 'Material', 'Payments','Labor','Booking','Helpdesk']
    }],
    required: true
  }
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
