const mongoose = require('mongoose');
const availabilitySchema = new mongoose.Schema({
  installer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Installer'
  },
  date: {
    type: Date,
    required: true
  },
  time_start: {
    type: Number,
    required: true
  },
  type:{
    type:String,
    enum:['ALL_DAY','PARTIAL','DISABLED']
  },
  time_end: {
    type: Number,
    required: true
  },
  installer_parked: {
    type: Boolean,
    default: false
  },
  installer_booked: {
    type: Boolean,
    defualt: false
  },
});
const Availability = mongoose.model('Availability', availabilitySchema);
module.exports = Availability;
