const mongoose = require('mongoose');
 const customerRatesSchema = new mongoose.Schema({
  service_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  number_of_installs: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});
 const CustomerRates = mongoose.model('CustomerRates', customerRatesSchema);
 module.exports = CustomerRates;