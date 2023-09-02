const mongoose = require('mongoose');
const parkedSchema = new mongoose.Schema({
  installer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Installer'
  },
  date: {
    type: Date,
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
const Installer_Parked = mongoose.model('Installer_Parked', parkedSchema);
module.exports = Installer_Parked;