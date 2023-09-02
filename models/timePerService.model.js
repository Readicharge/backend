const mongoose = require('mongoose');
const timeSchema = new mongoose.Schema({
    service_id:{
        type:mongoose.Types.ObjectId,
        required:true,
        
    },
    number_of_installs:{
        type:Number,
        required:true
    },
    time_min:{
        type:Number,
        required:true
    },
    time_max:{
        type:Number,
        required:true
    }
});



 const Time = mongoose.model('Time', timeSchema);
 module.exports = Time;