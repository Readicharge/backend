const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone_number: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  zip_code: {
    type: String,
    required: true,
  },
  address_line1: {
    type: String,
    required: true,
  },
  address_line2: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  company_name: {
    type: String,
    default: '',
  },
  details: {
    type: String,
    default: '',
  },
  number_of_chargers: {
    type: Number,
    default: 0,
  },
  booking_details:[
  {
    type:mongoose.Schema.Types.ObjectId, 
    ref:"Booking"
  }
  ],
  payment_details:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Payment"
    }
  ]

});

const User = mongoose.model('User', userSchema);

module.exports = User;
