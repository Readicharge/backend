const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
  // We need to add the details of the User as well , here we will keep the reference for the user 
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  machinePurchasedByUser: {
    type: Boolean,
    default: false
  },
  installer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Installer',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  time_start: {
    type: Number,
    required: true
  },
  time_end: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  labourRates: {
    type: Number,
    default: 0
  },
  materialCost: {
    type: Number,
    default: 0
  },
  customerShowingCost: {
    type: Number,
    required: true
  },
  number_of_installs: {
    type: Number,
    required: true
  },
  material_details: [{
    material_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Material',
      required: true
    },
    material_name: {
      type: String
    },
    number_of_materials: {
      type: Number,
      required: true
    }
  }],
  charger_details: [
    {
      model: {
        type: String
      },
      type: {
        type: String
      },
      Charger_received_by: {
        type: Date
      },
      exsisting_outlet: {
        type: String
      },
      upgraded_to_nema: {
        type: String,
        default: false
      },
      charger_location: {
        type: String
      },
      attached_home: {
        type: String,
        default: false
      },
      electrical_panel_location: {
        type: String
      },
      floor: {
        type: String
      },
      interior_wall_finish: {
        type: String
      },
      exterior_wall_finish: {
        type: String
      },
      wall_construction: {
        type: String
      },
      electrical_panel_type: {
        type: String
      },
      panel_brand: {
        type: String
      },
      main_breaker_size: {
        type: String
      },
      gretater_equal: {
        type: String
      },
      open_breakersL: {
        type: String
      },
      recessed_panel: {
        type: String
      },
      distance_panel: {
        type: String
      }
    }
  ],
  completion_steps: {
    // This is for the Overall completion and also verified from the Customer Side
    overall_completion: {
      status_installer: {
        type: Boolean,
        defualt: false
      },
      status_customer: {
        type: Boolean,
        defualt: false
      },
      rating: {
        type: Number,
        defualt: 3
      }
    },
    // This is for the I have Arrived
    stage_0: {
      status_installer: {
        type: Boolean,
        defualt: false
      },
      rating: {
        type: Number,
        defualt: 3
      }
    },
    // This is for the I have Started the Job 
    stage_1: {
      status_installer: {
        type: Boolean,
        defualt: false
      },
      rating: {
        type: Number,
        defualt: 3
      }
    },
    // This is for the I have completed the job ( Pending State  || Completed State )
    stage_2: {
      status_installer: {
        type: Boolean,
        defualt: false
      },
      status_customer: {
        type: Boolean,
        defualt: false
      },
      rating: {
        type: Number,
        defualt: 3
      }
    }
  },
    job_modyfying_ability_to_customer: {
      type: Boolean,
    },
    job_modified_status: {
      type: Boolean,
    },
    customer_payment_status: {
      type: String,
      enum: ['Pending', 'Paid'],
      default: 'Pending'
    },
    completionStatus: {
      type: String,
      enum: ['LIVE', 'COMPLETED','PENDING'],
      default: 'PENDING'
    },
    installer_payment_release_status: {
      material_stippend: {
        type: Number
      },
      installer_charge: {
        type: Number
      }
    },
    changedBy: {
      type: String,
    },
    payment_status:{
      payment_id:{
        type:String
      },
      amount_taken_from_customer:{
        type:String
      },
      amount_pending_to_pay_installer:{
        type:Number
      },
      amount_paid_to_installer:{
        type:Number
      },
      amount_captured_from_customer_card:{
        type:Boolean
      }

    }

  
});
const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
