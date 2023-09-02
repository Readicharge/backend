const mongoose = require('mongoose');
const scheduleSchema = new mongoose.Schema({
  installer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Installer',
  },
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  },
  startTime: {
    type: Number,
    default: 7,
  },
  endTime: {
    type: Number,
    default: 22,
  },
  active: {
    type: Boolean,
    default: true,
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
const Schedule = mongoose.model('Schedule', scheduleSchema);
module.exports = Schedule;