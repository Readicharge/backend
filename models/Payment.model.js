const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  payment_type: {
    type: String,
    enum: ['booking', 'subscription_referral','subscription_priority', 'purchase'],
    required: true,
  },
  seen:{
    type:Boolean,
    default:false
  },
  isIncoming:{
    type:Boolean,
    default:false
  },
  sequence_number:{
    type: Number,
    required: true
  },
  client_secret:{
    type: String,
    required: true
  },
  payment_id: {
    type: String,
    required: true
  },
  installer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Installer',
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  date:{
    type:Date,
    required:true
  },
  amount:{
    type:Number,
    required:true
  },
  Job_Id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Booking"
  },
  Job_Unique_Rc_id:{
   type:String,
  }

});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
