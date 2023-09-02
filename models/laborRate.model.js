const mongoose = require('mongoose');
 const priceSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});
 const LabourRatesSchema = new mongoose.Schema({
  service_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  number_of_installs: {
    type: Number,
    required: true
  },
  price_statewise: {
    type: [priceSchema],
    required: true
  }
});
 const LabourRates = mongoose.model('LabourRates', LabourRatesSchema);
 module.exports = LabourRates;