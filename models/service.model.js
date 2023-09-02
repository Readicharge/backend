const mongoose = require('mongoose');
const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  service_code:{
    type:String,
    enum: ["BI", "II", "AI", "AI80"]
  },
  description: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    required: true
  },
//   certification: {
//     type: String
//   },
  yearsOfExperience: {
    type: Number,
    default: 0
  }
});


const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;